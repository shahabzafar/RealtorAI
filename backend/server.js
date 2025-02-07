const express = require('express');
const axios = require('axios');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const RedisStore = require('connect-redis').default;
const redis = require('redis');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const helmet = require('helmet');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const multer = require('multer');
const csvParser = require('csv-parse');
const stream = require('stream');

const isProd = process.env.NODE_ENV === 'production';

const FRONTEND_URL = isProd
  ? process.env.FRONTEND_URL || 'https://realtoriq.onrender.com'
  : 'http://localhost:3000';

const BACKEND_URL = isProd
  ? process.env.BACKEND_URL || 'https://realtoriqbackend.onrender.com'
  : 'http://localhost:5000';

console.log('Current NODE_ENV:', process.env.NODE_ENV);
console.log('Frontend URL:', FRONTEND_URL);
console.log('Backend URL:', BACKEND_URL);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json());
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Origin', 'Authorization']
  })
);

app.options('/api/form/:realtorId', cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
  console.error('Using DATABASE_URL:', process.env.DATABASE_URL);
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error testing database connection:', err);
  } else {
    console.log('Database connected successfully at', res.rows[0].now);
  }
});

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'someSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProd,
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  },
  proxy: true
};

if (isProd && process.env.REDIS_URL) {
  const redisClient = redis.createClient({
    url: process.env.REDIS_URL
  });
  redisClient.connect().catch(console.error);
  redisClient.on('connect', () =>
    console.log('Connected to Redis successfully.')
  );
  redisClient.on('error', (err) =>
    console.error('Redis connection error:', err)
  );
  sessionConfig.store = new RedisStore({ client: redisClient });
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Database Helper Functions
async function findRealtorByGoogleId(googleId) {
  try {
    const result = await pool.query(
      'SELECT * FROM realtors WHERE google_id = $1',
      [googleId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in findRealtorByGoogleId:', error);
    throw error;
  }
}

async function createRealtor(userData) {
  try {
    const { googleId, firstName, lastName, email, phoneNumber } = userData;
    const result = await pool.query(
      `INSERT INTO realtors 
         (google_id, first_name, last_name, email, phone_number, created_at, updated_at)
       VALUES 
         ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [googleId, firstName, lastName, email, phoneNumber]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in createRealtor:', error);
    throw error;
  }
}

async function findRealtorById(id) {
  const result = await pool.query('SELECT * FROM realtors WHERE id = $1', [id]);
  return result.rows[0];
}

// Passport Strategies
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile:", profile);
        let realtor = await findRealtorByGoogleId(profile.id);
        if (!realtor) {
          realtor = await createRealtor({
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            phoneNumber: '',
          });
        }
        return done(null, realtor);
      } catch (err) {
        console.error("Google OAuth Error:", err);
        return done(err);
      }
    }
  )
);

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const result = await pool.query('SELECT * FROM realtors WHERE email = $1', [email]);
      const realtor = result.rows[0];
      if (!realtor) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }
      if (!realtor.password) {
        return done(null, false, { message: 'Please log in with Google.' });
      }
      const isValid = await bcrypt.compare(password, realtor.password);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }
      return done(null, realtor);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM realtors WHERE id = $1', [id]);
    const user = result.rows[0];
    if (user) {
      done(null, {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      });
    } else {
      done(new Error('User not found'));
    }
  } catch (error) {
    done(error);
  }
});

// Authentication Routes
app.post(
  '/auth/register',
  [
    body('firstName').isString(),
    body('lastName').isString(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('phoneNumber').optional().isMobilePhone()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    try {
      const existingUser = await pool.query('SELECT * FROM realtors WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Email already in use.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        `INSERT INTO realtors (first_name, last_name, email, password, phone_number, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
        [firstName, lastName, email, hashedPassword, phoneNumber]
      );
      const newRealtor = result.rows[0];
      req.login(newRealtor, (err) => {
        if (err) return next(err);
        res.json({
          message: 'Registration successful',
          user: {
            id: newRealtor.id,
            email: newRealtor.email,
            firstName: newRealtor.first_name,
            lastName: newRealtor.last_name,
            displayName: `${newRealtor.first_name} ${newRealtor.last_name}`
          }
        });
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

app.post('/auth/login', [body('email').isEmail(), body('password').exists()],
  (req, res, next) => {
    passport.authenticate('local', (err, realtor, info) => {
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }
      if (!realtor) {
        return res.status(401).json({ message: info.message });
      }
      req.logIn(realtor, (err) => {
        if (err) {
          console.error('Session error:', err);
          return next(err);
        }
        res.json({
          message: 'Login successful',
          user: {
            id: realtor.id,
            email: realtor.email,
            firstName: realtor.first_name,
            lastName: realtor.last_name,
            displayName: `${realtor.first_name} ${realtor.last_name}`
          }
        });
      });
    })(req, res, next);
  }
);

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`${FRONTEND_URL}/main`);
  }
);

app.get('/auth/status', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user
  });
});

app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated() && req.user) {
    const userData = {
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        displayName: `${req.user.firstName} ${req.user.lastName}`
      }
    };
    res.json(userData);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Failed to log out' });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Failed to destroy session' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'Unauthorized' });
}

app.post('/api/form/:realtorId', async (req, res) => {
  const realtorId = req.params.realtorId;
  const {
    firstName,
    lastName,
    phone,
    email,
    clientType,
    budget,
    location,
    amenities,
    property_images,
    notes,
    urgency,
    income,
    bankLoanEligibility,
    downPayment,
    canAffordDownPayment
  } = req.body;
  try {
    const insertQuery = `
      INSERT INTO clients
        (realtor_id, client_type, first_name, last_name, phone, email,
         budget, location, amenities, property_images, notes, created_at,
         urgency, income, bank_loan_eligibility, down_payment, can_afford_down_payment)
      VALUES
        ($1, $2, $3, $4, $5, $6,
         $7, $8, $9, $10, $11, NOW(),
         $12, $13, $14, $15, $16)
      RETURNING *
    `;
    const values = [
      realtorId,
      clientType,
      firstName,
      lastName,
      phone,
      email,
      budget || null,
      location || null,
      amenities || null,
      property_images || null,
      notes || null,
      urgency || null,
      income || null,
      bankLoanEligibility === true,
      downPayment || null,
      canAffordDownPayment === true
    ];
    const result = await pool.query(insertQuery, values);
    return res.json({
      message: 'Form submitted successfully',
      client: result.rows[0]
    });
  } catch (error) {
    console.error('Error saving form data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/clients', ensureAuthenticated, async (req, res) => {
  try {
    const query = `
      SELECT * FROM clients 
      WHERE realtor_id = $1 
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query, [req.user.id]);
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/clients/:clientId/pin', ensureAuthenticated, async (req, res) => {
  const { clientId } = req.params;
  const { pinned } = req.body;
  try {
    const query = `
      UPDATE clients
      SET pinned = $1, updated_at = NOW()
      WHERE id = $2 AND realtor_id = $3
      RETURNING *
    `;
    const values = [pinned, clientId, req.user.id];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Client not found or not authorized' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.error('Error updating pin status:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put(
  '/api/realtor/settings',
  ensureAuthenticated,
  [
    body('firstName').optional().isString(),
    body('lastName').optional().isString(),
    body('email').optional().isEmail(),
    body('phoneNumber').optional().isMobilePhone(),
    body('password').optional().isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    try {
      const realtor = await findRealtorById(req.user.id);
      if (!realtor) return res.status(404).json({ error: 'User not found' });
      let hashedPassword = null;
      if (realtor.google_id && realtor.password == null && password) {
        return res
          .status(400)
          .json({ error: 'Cannot update password for an OAuth-based account.' });
      }
      if (password && !realtor.google_id) {
        hashedPassword = await bcrypt.hash(password, 10);
      }
      const updateQuery = `
        UPDATE realtors
        SET
          first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          email = COALESCE($3, email),
          phone_number = COALESCE($4, phone_number),
          password = COALESCE($5, password),
          updated_at = NOW()
        WHERE id = $6
        RETURNING *
      `;
      const values = [
        firstName || null,
        lastName || null,
        email || null,
        phoneNumber || null,
        hashedPassword || null,
        req.user.id
      ];
      const { rows } = await pool.query(updateQuery, values);
      const updatedRealtor = rows[0];
      return res.json({
        message: 'Settings updated',
        user: {
          id: updatedRealtor.id,
          email: updatedRealtor.email,
          firstName: updatedRealtor.first_name,
          lastName: updatedRealtor.last_name,
          phoneNumber: updatedRealtor.phone_number
        }
      });
    } catch (error) {
      console.error('Settings update error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

app.post('/generate-link', ensureAuthenticated, async (req, res) => {
  const generatedLink = `${FRONTEND_URL}/form/${req.user.id}`;
  return res.json({ link: generatedLink });
});

// Use memoryStorage for multer uploads
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/clients/import-csv', ensureAuthenticated, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No CSV file uploaded' });
  }
  const columnMapping = req.body.mapping ? JSON.parse(req.body.mapping) : {};
  
  try {
    const records = await new Promise((resolve, reject) => {
      const parsedRows = [];
      const parser = csvParser({
        columns: true,
        skip_empty_lines: true
      });
      parser.on('readable', () => {
        let record;
        while ((record = parser.read()) !== null) {
          parsedRows.push(record);
        }
      });
      parser.on('error', err => reject(err));
      parser.on('end', () => resolve(parsedRows));
      
      const csvStream = stream.Readable.from([req.file.buffer]);
      csvStream.pipe(parser);

    });
  
    for (const row of records) {
      const insertData = {
        realtor_id: req.user.id,
        client_type: (row[columnMapping.clientType] || 'buyer').toLowerCase(),
        first_name: row[columnMapping.firstName] || 'Unknown',
        last_name: row[columnMapping.lastName] || 'Unknown',
        phone: row[columnMapping.phone] || null,
        email: row[columnMapping.email] || null,
        budget: row[columnMapping.budget] || null,
        location: row[columnMapping.location] || null,
        amenities: row[columnMapping.amenities] || null,
      };
  
      await pool.query(
        `INSERT INTO clients (realtor_id, client_type, first_name, last_name, phone, email,
                                budget, location, amenities, pinned, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, false, NOW())`,
        [
          insertData.realtor_id,
          insertData.client_type,
          insertData.first_name,
          insertData.last_name,
          insertData.phone,
          insertData.email,
          insertData.budget,
          insertData.location,
          insertData.amenities
        ]
      );
    }
  
    return res.json({ message: 'CSV import completed', count: records.length });
  } catch (error) {
    console.error('CSV import error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/auth/check', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user,
    session: req.session
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
});

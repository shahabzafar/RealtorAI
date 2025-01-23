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

// First declare environment variables
const FRONTEND_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://realtoriq.onrender.com';

const BACKEND_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'https://realtoriqbackend.onrender.com';

// Force development mode if needed
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'development';
}

// Log environment info
console.log('Current environment:', process.env.NODE_ENV);
console.log('Frontend URL:', FRONTEND_URL);
console.log('Backend URL:', BACKEND_URL);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(express.json());
app.set('trust proxy', 1); // trust first proxy
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
});
app.use(limiter);

// Database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Session config
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
};

if (process.env.NODE_ENV === 'production') {
  const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
  });
  redisClient.connect().catch(console.error);
  redisClient.on('connect', () => console.log('Connected to Redis successfully.'));
  redisClient.on('error', (err) => console.error('Redis connection error:', err));
  sessionConfig.store = new RedisStore({ client: redisClient });
}

// CORS
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// ============================
// Database helper functions
// ============================
async function findRealtorByGoogleId(googleId) {
  const result = await pool.query('SELECT * FROM realtors WHERE google_id = $1', [googleId]);
  return result.rows[0];
}

async function createRealtor(userData) {
  const { googleId, firstName, lastName, email, phoneNumber } = userData;
  const result = await pool.query(
    `INSERT INTO realtors (google_id, first_name, last_name, email, phone_number)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [googleId, firstName, lastName, email, phoneNumber]
  );
  return result.rows[0];
}

async function findRealtorById(id) {
  const result = await pool.query('SELECT * FROM realtors WHERE id = $1', [id]);
  return result.rows[0];
}

// ============================
// Passport Strategies
// ============================

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
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
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Local strategy
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

// Serialize / Deserialize
passport.serializeUser((realtor, done) => {
  done(null, realtor.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const realtor = await findRealtorById(id);
    done(null, realtor);
  } catch (error) {
    done(error);
  }
});

// ============================
// Authentication Routes
// ============================
app.post(
  '/auth/register',
  [
    body('firstName').isString(),
    body('lastName').isString(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('phoneNumber').optional().isMobilePhone(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, phoneNumber } = req.body;

    try {
      // Check if email exists
      const existingUser = await pool.query('SELECT * FROM realtors WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Email already in use.' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new realtor
      const result = await pool.query(
        `INSERT INTO realtors (first_name, last_name, email, password, phone_number)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [firstName, lastName, email, hashedPassword, phoneNumber]
      );
      const newRealtor = result.rows[0];

      // Auto-login
      req.login(newRealtor, (err) => {
        if (err) return next(err);
        res.json({
          message: 'Registration successful',
          user: {
            id: newRealtor.id,
            email: newRealtor.email,
            firstName: newRealtor.first_name,
            lastName: newRealtor.last_name,
            displayName: `${newRealtor.first_name} ${newRealtor.last_name}`,
          },
        });
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

app.post(
  '/auth/login',
  [body('email').isEmail(), body('password').exists()],
  (req, res, next) => {
    passport.authenticate('local', (err, realtor, info) => {
      if (err) return next(err);
      if (!realtor) {
        return res.status(400).json({ message: info.message });
      }
      req.logIn(realtor, (err) => {
        if (err) return next(err);
        res.json({
          message: 'Login successful',
          user: {
            id: realtor.id,
            email: realtor.email,
            firstName: realtor.first_name,
            lastName: realtor.last_name,
            displayName: `${realtor.first_name} ${realtor.last_name}`,
          },
        });
      });
    })(req, res, next);
  }
);

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`${FRONTEND_URL}/main`); // after Google login, go to main page
  }
);

// Check auth
app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated() && req.user) {
    const userData = {
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        displayName: `${req.user.first_name} ${req.user.last_name}`,
      },
    };
    res.json(userData);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Logout
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

// Helper: check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'Unauthorized' });
}

// =====================================
//  Client (Buyer/Seller) Form Endpoints
// =====================================

// Public form submission endpoint - e.g., /api/form/:realtorId
app.post(
  '/api/form/:realtorId',
  [
    body('firstName').isString(),
    body('lastName').isString(),
    body('phone').isString(),
    body('email').isEmail(),
    body('clientType').isIn(['buyer', 'seller']),
    // add validation for other fields as needed
  ],
  async (req, res) => {
    // This endpoint does NOT require auth, because clients fill it out
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
      // For sellers
      propertyImages,
      notes,
    } = req.body;

    try {
      const insertQuery = `
        INSERT INTO clients
          (realtor_id, client_type, first_name, last_name, phone, email, budget, location, amenities, property_images, notes)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`;
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
        propertyImages || null, // could be an array of URLs
        notes || null,
      ];

      const result = await pool.query(insertQuery, values);
      return res.json({ message: 'Form submitted successfully', client: result.rows[0] });
    } catch (error) {
      console.error('Error saving form data:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// Get all clients for a specific realtor
app.get('/api/clients', ensureAuthenticated, async (req, res) => {
  try {
    const realtorId = req.user.id;
    const query = `
      SELECT * FROM clients
      WHERE realtor_id = $1
      ORDER BY pinned DESC, created_at DESC
    `;
    const { rows } = await pool.query(query, [realtorId]);
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Pin/Unpin a client
app.put('/api/clients/:clientId/pin', ensureAuthenticated, async (req, res) => {
  const { clientId } = req.params;
  const { pinned } = req.body; // boolean
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

// Settings update
app.put(
  '/api/realtor/settings',
  ensureAuthenticated,
  [
    body('firstName').optional().isString(),
    body('lastName').optional().isString(),
    body('email').optional().isEmail(),
    body('phoneNumber').optional().isMobilePhone(),
    body('password').optional().isLength({ min: 6 }),
  ],
  async (req, res) => {
    // If user is OAuth-based (google_id != null, password == null?), do not allow password changes
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phoneNumber, password } = req.body;
    try {
      // fetch the user
      const realtor = await findRealtorById(req.user.id);
      if (!realtor) return res.status(404).json({ error: 'User not found' });

      // if they have a google_id and no local password, do not allow password changes
      let hashedPassword = null;
      if (realtor.google_id && realtor.password == null && password) {
        // Do not allow changing password for OAuth user
        return res
          .status(400)
          .json({ error: 'Cannot update password for an OAuth-based account.' });
      }
      if (password && !realtor.google_id) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      // if they have google oauth, allow email to be changed only as "contact email" but not for login
      // (Up to you how strictly you want to handle this. This is a simplified example.)

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
        req.user.id,
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
          phoneNumber: updatedRealtor.phone_number,
          // do not return password
        },
      });
    } catch (error) {
      console.error('Settings update error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// Example “generate link” (similar to your Zapier route) => or you can skip
app.post('/generate-link', ensureAuthenticated, async (req, res) => {
  // You can build a front-end route like /form/${req.user.id} or a shorter slug 
  const generatedLink = `${FRONTEND_URL}/form/${req.user.id}`;
  return res.json({ link: generatedLink });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${BACKEND_URL}`);
  console.log('Environment:', process.env.NODE_ENV);
});

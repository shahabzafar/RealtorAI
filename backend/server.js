const express = require('express');
const cors = require('cors');
const axios = require('axios');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Configure session management
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Define OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:3000/realtor');
  }
);

// Route to check if the user is authenticated
app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to log out' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });
  

let sellerData = {};

app.post('/generate-link', async (req, res) => {
    try {
        const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL;

        // zapier response 
        const zapierResponse = await axios.post(zapierWebhookUrl, {
            realtorId: req.body.realtorId // realtorId is the database key to the realtor requesting the link
        });

        // Assuming Zapier sends back the link in zapierResponse.data.link 
        // const generatedLink = req.body.link;
        // const generatedLink = zapierResponse.data.link;

        const generatedLink = "https://form-interface-ee593b.zapier.app/";
        if (generatedLink) {
            console.log("Received link from Zapier:", generatedLink);
            res.json({ link: generatedLink });
        } else {
            console.error("Error: Zapier response does not contain a link.");
            res.status(500).json({ error: "Failed to generate link." });
        }
    } catch (error) {
        console.error('Error generating link from Zapier:', error);
        res.status(500).send('Error generating link');
    }
});

// POST endpoint to receive data from Zapier
// For now the data is printed on the console
app.post("/setSellerData", (req, res) => {

    const { LeadName, Contact, LeadEmail, AskingPrice } = req.body;
    console.log("Data received from Zapier:", { LeadName, Contact, LeadEmail, AskingPrice });


    sellerData = { LeadName, Contact, LeadEmail, AskingPrice }; // Store the data from Zapier tables

    res.json({ message: "Data received successfully!" });
});

// Send data to the frontend (GeneratedLeads.jsx)
app.get('/getSellerData', (req, res) => {
    res.json(sellerData);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

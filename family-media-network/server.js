const express = require('express');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Security and Global Middleware Setup
app.use(helmet({ contentSecurityPolicy: false })); // Permissive CSP for Acode live previews
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // Local session timeline configuration
}));

// Route Definitions
const mediaRouter = require('./src/routes/media.routes.js');
app.use('/api', mediaRouter);

// Statically Serve Content Matrix
app.use(express.static('public'));
app.use('/storage', express.static('public/storage'));

// Start Server Loop
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`\n🚀 [SUCCESS] Server running locally on your tablet.`);
    console.log(`🔗 Target URL: http://localhost:${PORT}`);
});

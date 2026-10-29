const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Core Security & Parsing Middleware Setup
app.use(helmet({ 
  contentSecurityPolicy: false // Allows raw asset streaming and dynamic template updates
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Route Definition for Central Landing Hub & Core Static Files
app.use(express.static(path.join(__dirname, 'public')));

// 3. Dedicated Route Endpoint for Adrian West's Sub-Projects
// This ensures paths inside the book's code don't conflict with your network assets
app.use('/projects', express.static(path.join(__dirname, 'public/adrian-west-projects')));

// 4. Centralized Error Handler Middleware 
app.use((err, req, res, next) => {
  console.error('Master Engine Error Stack:', err.stack);
  res.status(500).json({ error: 'Internal Server Error Encountered within Workspace' });
});

// 5. Fire Up App Engine
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Unified Web Development Master Engine Active`);
  console.log(`📱 Access your DevCoreX project: http://localhost:${PORT}`);
  console.log(`==================================================`);
});

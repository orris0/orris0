const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// 1. --- SECURITY MIDDLEWARE ---
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());

// 2. --- VIEW ENGINE SETUP (EJS) ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 3. --- BODY PARSERS & STATIC ARCHIVE SERVING ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 4. --- SESSION STORAGE MANAGEMENT ---
app.use(session({
    secret: process.env.SESSION_SECRET || 'family-media-network-secure-fallback',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 Hour active session limit
}));

// 5. --- CUSTOM REQUEST LOGGER ---
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 6. --- CORE PAGE RENDERING ROUTES ---
app.get('/', (req, res) => {
    res.render('index', { title: 'Family Media Network', message: 'Welcome to your digital workspace' });
});
app.get('/login', (req, res) => res.render('login', { title: 'Admin Login' }));
app.get('/register', (req, res) => res.render('register', { title: 'Create Account' }));

// 7. --- MOUNT MODULAR SUB-ROUTERS ---
app.use('/auth', require('./src/routes/auth.routes.js'));
app.use('/admin', require('./src/routes/admin.routes.js'));
app.use('/shop', require('./src/routes/shop.routes.js'));
app.use('/api', require('./src/routes/api.routes.js'));
app.use('/pages', require('./src/routes/page.routes.js'));

// 8. --- FALLBACK 404 INTERCEPTOR ---
app.use((req, res) => {
    res.status(404).send('<h1>404 - Workspace Resource Not Found</h1>');
});

// 9. --- BOOT THE SERVER ENGINE ---
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Family Media Network Engine Active`);
    console.log(`📱 Access your DevCoreX project: http://localhost:${PORT}`);
    console.log(`==================================================`);
});

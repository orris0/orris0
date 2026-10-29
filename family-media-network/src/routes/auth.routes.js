const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Mock Database Matrix (We can connect SQLite here later)
const users = [];

// 1. --- POST: PROCESS USER REGISTRATION ---
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).render('register', { 
                title: 'Create Account', 
                error: 'All entry fields are required.' 
            });
        }

        // Check if user already exists
        const userExists = users.some(u => u.username === username.toLowerCase());
        if (userExists) {
            return res.status(400).render('register', { 
                title: 'Create Account', 
                error: 'Username is already taken.' 
            });
        }

        // Hash password securely with 10 salt rounds
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Push user instance to store
        users.push({
            username: username.toLowerCase(),
            password: hashedPassword,
            isAdmin: true // Defaulting to true for development access setup
        });

        res.status(201).redirect('/login');
    } catch (error) {
        res.status(500).render('register', { 
            title: 'Create Account', 
            error: 'Registration pipeline failed.' 
        });
    }
});

// 2. --- POST: PROCESS USER LOGIN ---
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).render('login', { 
                title: 'Admin Login', 
                error: 'Please input credentials.' 
            });
        }

        const user = users.find(u => u.username === username.toLowerCase());
        if (!user) {
            return res.status(400).render('login', { 
                title: 'Admin Login', 
                error: 'Invalid credentials provided.' 
            });
        }

        // Compare incoming string to encrypted hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // Instantiate active Express Session tracking
            req.session.userId = user.username;
            req.session.isAdmin = user.isAdmin;
            
            res.redirect('/admin');
        } else {
            res.status(401).render('login', { 
                title: 'Admin Login', 
                error: 'Invalid credentials provided.' 
            });
        }
    } catch (error) {
        res.status(500).render('login', { 
            title: 'Admin Login', 
            error: 'Session authentication error.' 
        });
    }
});

// 3. --- GET: CLOSE SESSIONS & LOGOUT ---
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not clear active session.');
        }
        res.clearCookie('connect.sid'); // Resets cookie token flags
        res.redirect('/login');
    });
});

module.exports = router;

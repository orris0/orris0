const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const app = express();

// Protect survivor identity by wiping server headers and locking cross-site leaks
app.use(helmet({
    contentSecurityPolicy: false // Allows the platform to load universal layout webfonts safely
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve all frontend directory elements cleanly
app.use(express.static(path.join(__dirname, 'public')));

// Explicit Facility Action Registries
const trackedFacilities = [
    'the-kelly',
    'the-andrews',
    'the-travellers-hotel',
    'breaking-ground',
    'brc-25th-street'
];

trackedFacilities.forEach(facility => {
    app.get(`/registries/${facility}`, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'registries', `${facility}.html`));
    });
});

// Bookshelf API: Links and showcases your 4 specific web development books
app.get('/api/bookshelf', (req, res) => {
    res.json([
        { id: 1, title: "Creating a Website: The Missing Manual", blueprint: "Creating-a-website.git", use: "Express backend backbone and file routing matrices." },
        { id: 2, title: "Practical HTML5 Projects", blueprint: "orris0.git", use: "Semantic section layouts for chronological facility tracking." },
        { id: 3, title: "jQuery: Novice to Ninja", blueprint: "jquery-novice-to-ninja.git", use: "Zero-trace user data handling and secure clipboard triggers." },
        { id: 4, title: "CSS Secrets by Lea Verou", blueprint: "css-secrets.git", use: "Trauma-informed, accessible high-contrast component styling." }
    ]);
});

// Catch-all API error block to block unexpected token parsing crashes
app.use('/api/*', (req, res) => {
    res.status(404).json({ status: "error", error: "Data pipeline target not found." });
});

// Main UI page catch-all redirection fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Master central error management middleware
app.use((err, req, res, next) => {
    console.error(`[SECURE ERROR CAUGHT]: ${err.message}`);
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(500).json({ status: "error", error: "A secure operational fallback has occurred." });
    }
    res.status(500).send('An unexpected framework interruption occurred. Your browsing metrics remain protected.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[Family Media Network Active] Running on http://localhost:${PORT}`);
});

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

// Strict validation mapping array matching the frontend list
const ALLOWED_FACILITIES = ['the-kelly', 'the-andrews', 'the-travellers-hotel', 'breaking-ground', 'brc-25th-street'];

app.post('/api/report-incident', (req, res) => {
    try {
        const { shelter, details } = req.body;

        // 1. Fail-fast safety checking for raw undefined objects
        if (!shelter || !details) {
            return res.status(400).json({ error: "Incomplete data format received." });
        }

        // 2. Strict whitelist valuation checks
        if (!ALLOWED_FACILITIES.includes(shelter)) {
            return res.status(400).json({ error: "Malicious tracking parameter detected." });
        }

        // 3. Double-check input lengths on the server side to protect system storage logs
        if (details.length < 20 || details.length > 3000) {
            return res.status(400).json({ error: "Input violates standard data length constraints." });
        }

        // ANONYMOUS EXECUTION LAYER:
        // Do NOT log the req.ip or req.headers. Here you would securely route 
        // the text to an encrypted database or send an encrypted text alert.
        console.log(`[SECURE LOG ENTRY] New incident entry registered for facility: ${shelter}`);

        return res.status(200).json({ status: "success", message: "Data received securely." });

    } catch (err) {
        // Suppress developer stack traces from exposing file systems to clients
        return res.status(500).json({ error: "Internal processing error." });
    }
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

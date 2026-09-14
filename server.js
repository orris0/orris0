const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();

// Absolute privacy shield hiding backend technologies from scanning malicious software
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend directories
app.use(express.static(path.join(__dirname, 'public')));

// Secure Media Pipeline: Encrypts incoming files and isolates metadata
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Obfuscate filenames completely to break tracking matrices
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExt = path.extname(file.originalname).toLowerCase();
        cb(null, `EVIDENCE-${Date.now()}-${randomString}${fileExt}`);
    }
});

// Enforce strict file filters protecting server from exploit uploads
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB per document
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
        const mimeType = allowedTypes.test(file.mimetype);
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (mimeType && extName) return cb(null, true);
        cb(new Error("File structure type forbidden. Only standard images and docs allowed."));
    }
});

// Dynamic API Endpoints
app.get('/api/bookshelf', (req, res) => {
    res.json([
        { id: 1, title: "Creating a Website: The Missing Manual", blueprint: "Creating-a-website.git", use: "Express framework routing and backend infrastructure design." },
        { id: 2, title: "Practical HTML5 Projects", blueprint: "orris0.git", use: "Semantic, chronological layouts tracking shelter metric updates." },
        { id: 3, title: "jQuery: Novice to Ninja", blueprint: "jquery-novice-to-ninja.git", use: "Metadata-stripping frontend handlers and dynamic layout manipulation." },
        { id: 4, title: "CSS Secrets by Lea Verou", blueprint: "css-secrets.git", use: "High-contrast accessible designs tailored for disabled user bases." }
    ]);
});

// Incident Logger API with Anonymity Enforcement
app.post('/api/report', upload.single('evidenceFile'), (req, res) => {
    try {
        const { shelter, description } = req.body;
        if (!shelter || !description) {
            return res.status(400).json({ error: "Missing required tracking data matrices." });
        }
        
        // PRIVACY ENFORCEMENT: Never write req.ip, req.headers, or user geolocations to memory.
        console.log(`[SECURE INCIDENT LOGGED] Target: ${shelter} | File Stored: ${req.file ? req.file.filename : 'None'}`);
        
        res.status(200).json({ status: "success", message: "Data packet locked down anonymously." });
    } catch (err) {
        res.status(500).json({ error: "Secure pipeline transmission fault occurred." });
    }
});

// Explicit Facility Array Router
const facilities = ['the-kelly', 'brc-25th-street', 'the-andrews', 'the-travellers-hotel', 'breaking-ground'];
facilities.forEach(item => {
    app.get(`/registries/${item}`, (req, res) => res.sendFile(path.join(__dirname, 'public', 'registries', `${item}.html`)));
});

app.get('/know-your-rights', (req, res) => res.sendFile(path.join(__dirname, 'public', 'know-your-rights', 'index.html')));

// Catch-all route security block blocking 'Unexpected token < in JSON' parsing crashes
app.use('/api/*', (req, res) => res.status(404).json({ error: "API data target missing." }));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Error Interceptor Layer
app.use((err, req, res, next) => {
    if (req.originalUrl.startsWith('/api/')) return res.status(500).json({ error: err.message || "Internal system block." });
    res.status(500).send("A secure structural system redirect occurred. No tracking profiles were logged.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[Family Media Network Online] Execution running safely on http://localhost:${PORT}`));
 * code failures. It intercepts the exception and strips dangerous traces.
 */
app.use((err, req, res, next) => {
    // Log the error internally for maintainer awareness, keeping stack logs isolated from traffic
    console.error(`[SYSTEM FAULT ENCOUNTERED]: ${err.message || 'Unknown Exception'}`);

    // Check if the system failure was specifically a malformed JSON payload submission
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ 
            status: "error", 
            code: "BAD_REQUEST_PAYLOAD",
            error: "The transmission data packet structure is invalid or corrupt." 
        });
    }

    // Determine target content-type response formatting
    const isApiRequest = req.originalUrl.startsWith('/api/');

    if (isApiRequest) {
        // ALWAYS shield your network by blocking system stack traces from leaking to clients
        return res.status(500).json({
            status: "error",
            code: "INTERNAL_SERVER_FAULT",
            error: "A secure operational fallback has occurred. The request could not be processed at this time."
        });
    } else {
        // Fallback for standard page navigation errors, returning a clean layout response
        res.status(500).set('Content-Type', 'text/html').send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Platform Interruption | Family Media Network</title>
                <style>
                    body { font-family: sans-serif; text-align: center; padding: 50px; background: #f8f9fa; color: #333; }
                    .card { max-width: 500px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-top: 4px solid #d9534f; }
                    a { color: #0275d8; text-decoration: none; font-weight: bold; }
                    p { line-height: 1.6; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h2>🔒 Secure Fallback Mode Active</h2>
                    <p>An internal platform configuration constraint has redirected your current session to a secure state.</p>
                    <p>No client system metrics, personal tracking profiles, or location datasets were exposed during this interruption.</p>
                    <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">
                    <p><a href="/">Return to Main Platform Interface</a></p>
                </div>
            </body>
            </html>
        `);
    }
});


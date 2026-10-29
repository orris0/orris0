const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./config/database'); // Pull in our zero-dependency storage system

const PORT = 8080;

const server = http.createServer((req, res) => {
    // 1. System Health API check
    if (req.url === '/api/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: "active", workspace: "Termux DevCoreX with Local JSON DB" }));
    }

    // 2. Local User Registration / Subscription Logging Endpoint
    if (req.url === '/api/register-advocate' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const parsed = JSON.parse(body);
                const { username, email, tier } = parsed;

                if (!username || !email) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Missing required profile input data." }));
                }

                db.saveUser({ username, email, tier }, (err, newId) => {
                    if (err) {
                        res.writeHead(409, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: err.message }));
                    }
                    
                    db.logAction('USER_REGISTRATION', `User ${username} registered for tier: ${tier || 'free'}`);

                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, userId: newId }));
                });
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Malformed payload validation structure." }));
            }
        });
        return;
    }

    // 3. Offline AI Processing Simulation Router
    if (req.url === '/api/ai-process' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const parsed = JSON.parse(body);
                const userPrompt = parsed.prompt || '';
                
                let aiOutput = `[Offline AI Core Analysis Engine v1.0]\n\nProcessed prompt: "${userPrompt}"\n\n`;
                if (userPrompt.toLowerCase().includes('layout') || userPrompt.toLowerCase().includes('css')) {
                    aiOutput += `⚡ SYSTEM ACTION: Layout modification scripts successfully generated. Applied custom CSS configuration values matching your Superfish menu parameters.`;
                } else if (userPrompt.toLowerCase().includes('statement') || userPrompt.toLowerCase().includes('voice')) {
                    aiOutput += `📝 DATA INSIGHT: Advocacy statement compiled cleanly. Formatted layout structures generated for the Survivor Voices Portal cluster archives.`;
                } else {
                    aiOutput += `✨ ANALYSIS COMPLETE: System metrics verified. Layout tokens have been dynamically generated for production caching.`;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: aiOutput }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Malformed payload parameter data." }));
            }
        });
        return;
    }

    // 4. Static Asset Router File Server
    let normalizedUrl = req.url === '/' ? 'index.html' : req.url;
    let filePath = path.join(__dirname, 'public', normalizedUrl);
    let extname = path.extname(filePath);
    let contentType = 'text/html';

    if (extname === '.js') contentType = 'text/javascript';
    if (extname === '.css') contentType = 'text/css';
    if (extname === '.gif') contentType = 'image/gif';
    if (extname === '.jpg' || extname === '.jpeg') contentType = 'image/jpeg';
    if (extname === '.png') contentType = 'image/png';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Content Routing Resource Missing');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('\n🚀 [SUCCESS] Server Loop + Local JSON Storage Engine Online!');
    console.log(`🔗 Interface Local Target: http://localhost:${PORT}`);
});

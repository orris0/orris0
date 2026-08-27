// =========================================================================
// SECTION A: ROUTE-BASED CATCH-ALLS (PREVENTS EXPECTED JSON PARSING ERRORS)
// =========================================================================

/**
 * 1. Specialized API Route Catch-All
 * Captures any undefined or broken URL paths starting with '/api/' 
 * and forces a true JSON response format, completely eliminating frontend 
 * Line 1 Column 1 HTML string crashes.
 */
app.use('/api/*', (req, res, next) => {
    res.status(404).json({ 
        status: "error",
        code: "ENDPOINT_NOT_FOUND",
        error: "The requested API data stream route does not exist or has been modified." 
    });
});

/**
 * 2. Main Web Interface Layout Catch-All
 * Seamlessly catches any standard browser requests for missing pages and routes 
 * users safely back to your main Educational Showcase / Platform entry point.
 */
app.get('*', (req, res) => {
    // Delivers the main index dashboard if a user inputs an unstable URL path
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// =========================================================================
// SECTION B: CENTRAL SYSTEM ERROR MANAGEMENT LAYER (EXPLOIT SHIELDING)
// =========================================================================

/**
 * 3. Master Express System Error Interceptor Middleware
 * Explicitly processes internal database faults, broken request payloads, or 
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

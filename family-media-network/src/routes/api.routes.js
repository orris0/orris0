const express = require('express');
const router = express.Router();

// Example API endpoint
router.get('/status', (req, res) => {
    res.json({ status: 'success', message: 'API is operational' });
});

module.exports = router;

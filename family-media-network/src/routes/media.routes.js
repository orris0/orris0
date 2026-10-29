const express = require('express');
const router = express.Router();

// Route to dynamically check structural system health
router.get('/health', (req, res) => {
    res.json({ status: "active", workspace: "Termux Android Tablet" });
});

module.exports = router;

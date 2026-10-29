const express = require('express');
const router = express.Router();

// Example supplementary page route
router.get('/about', (req, res) => {
    res.render('about', { title: 'About Family Media Network' });
});

module.exports = router;

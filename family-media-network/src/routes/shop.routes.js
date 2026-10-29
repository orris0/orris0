const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('shop', { title: 'Digital Marketplace' });
});

module.exports = router;

// routes/searchRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Search for products
router.get('/search', (req, res) => {
    const { query } = req.query;
    const sql = 'SELECT * FROM products WHERE name LIKE ?';
    db.query(sql, [`%${query}%`], (err, results) => {
        if (err) {
            console.error('Error executing search query:', err);
            res.status(500).json({ error: 'Error executing search query' });
            return;
        }
        res.json(results);
    });
});

module.exports = router;

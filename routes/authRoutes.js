// routes/authRoutes.js

const express = require('express'); // Add this line to import express module
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/register', (req, res) => {
    console.log('Received request to register:', req.body);
    authController.register(req, res);
});

router.post('/login', authController.login);
router.get('/home', (req, res) => {
    res.send('Welcome to the homepage');
});

module.exports = router;

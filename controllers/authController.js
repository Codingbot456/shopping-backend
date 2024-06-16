const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.register = (req, res) => {
    const { name, email, password, location } = req.body;

    if (!name || !email || !password || !location) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findByEmail(email, (err, result) => {
        if (err) return res.status(500).json({ msg: 'Server error' });
        if (result.length > 0) {
            return res.status(400).json({ msg: 'Email already in use' });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ msg: 'Server error' });

            const newUser = { name, email, password: hash, location };
            User.create(newUser, (err, result) => {
                if (err) return res.status(500).json({ msg: 'Server error' });
                res.status(201).json({ msg: 'User registered successfully' });
            });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findByEmail(email, (err, result) => {
        if (err) return res.status(500).json({ msg: 'Server error' });
        if (result.length === 0) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        const user = result[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ msg: 'Server error' });
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid email or password' });
            }

            const token = jwt.sign({ id: user.id }, 'jwtSecret', { expiresIn:  14400});
            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    location: user.location
                }
            });
        });
    });
};

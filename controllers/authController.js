const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Register a user
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });

        // Create user
        const user = await User.create({ name, email, password, isAdmin: false });
        res.status(201).json({ user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    register,
    login
}
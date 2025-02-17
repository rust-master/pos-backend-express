const express = require('express');
const passport = require('passport');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// **JWT Authentication Routes**
router.post('/register', register);
router.post('/login', login);

// **Google OAuth Routes**
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
    passport.authenticate('google', { session: true }),
    (req, res) => {
        res.json({ message: 'Google login successful', user: {name: req.user.name, email:req.user.email }});
    }
);

module.exports = router;

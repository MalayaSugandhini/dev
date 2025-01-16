const express = require('express');
const bcrypt = require('bcryptjs'); // For password hashing
const User = require('../models/User'); // Import User model
const router = express.Router();

// Use express-session to store session data
router.use(require('express-session')({
    secret: 'your-secret-key', // A secret key to sign the session ID cookie
    resave: false,
    saveUninitialized: true
}));

// ✅ SIGNUP Route - Save user in MongoDB
router.post('/signup', async (req, res) => {
    const { fullname, email, username, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists with this email!" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ fullname, email, username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!", redirect: "/login" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Failed to register user." });
    }
});

// ✅ LOGIN Route - Validate user credentials
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "User not found!" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password!" });
        }

        // On successful login, save user in session
        req.session.user = user;

        // Send success response with redirect info
        res.json({ message: "Login successful!", redirect: "/" }); // Redirect to home page after successful login
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Login failed. Try again." });
    }
});


// ✅ LOGOUT Route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to logout." });
        }
        // Ensure to clear the session data and redirect properly
        res.clearCookie('connect.sid'); // This clears the session cookie
        res.redirect('/login'); // Redirect to login page after logout
    });
});


module.exports = router;

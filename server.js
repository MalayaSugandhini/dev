const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const session = require('express-session'); // Import express-session

dotenv.config();
const app = express();

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure the views folder is set correctly

// Set up express-session
app.use(session({
    secret: 'your-secret-key', // A secret key to sign the session ID cookie
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Needed to parse form data
app.use(express.static(path.join(__dirname, 'public')));

// ✅ MongoDB Connection
console.log("MongoDB URI:", process.env.MONGO_URI); // Debugging purpose
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Handle MongoDB errors
mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Connection Error:", err);
});

// ✅ Use Routes (Now all authentication routes are handled in `userRoutes.js`)
app.use('/api', userRoutes);

// ✅ Serve HTML Pages
app.get('/', (req, res) => {
    // Pass the logged-in username to the index.ejs
    res.render('index', { username: req.session.user ? req.session.user.username : null });
});

app.get('/about', (req, res) => res.render('about')); 
app.get('/contact', (req, res) => res.render('contact')); 
app.get('/login', (req, res) => res.render('login')); 
app.get('/signup', (req, res) => res.render('signup')); 
app.get('/logout', (req, res) => res.redirect('/login'));

// 404 Page (Handles all unknown routes)
app.use((req, res) => res.status(404).render('404')); // Ensure 404 is rendered properly

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

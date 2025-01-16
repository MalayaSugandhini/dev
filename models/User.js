const mongoose = require('mongoose');

// Define User Schema for authentication
const UserSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true } // Hashed password
}, { timestamps: true }); // Automatically adds createdAt & updatedAt

module.exports = mongoose.model('User', UserSchema);

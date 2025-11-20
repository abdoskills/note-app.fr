const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    console.log("Register request received:", req.body);
    
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    user = new User({ username, email, password });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Save user
    await user.save();
    console.log("User saved:", user.id);

    // Create JWT token
    const payload = { user: { id: user.id } };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.error("JWT error:", err);
          return res.status(500).json({ message: "Error generating token" });
        }
        console.log("Token generated successfully");
        res.json({ token });
      }
    );

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const payload = { user: { id: user.id } };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.error("JWT error:", err);
          return res.status(500).json({ message: "Error generating token" });
        }
        console.log("Login successful, token generated");
        res.json({ token });
      }
    );

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

module.exports = router;
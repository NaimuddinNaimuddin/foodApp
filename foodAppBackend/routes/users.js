const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
const generateToken = require("../config/jwt");

// Signup API
router.post("/signup", async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: "Phone number already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            phone,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error });
    }
});

router.post("/login", async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: "Invalid phone or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Bcrypt Error.", error: 'Bcrypt err.' });
        }
        const token = generateToken(user);
        console.log(token)
        // Login successful
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                phone: user.phone,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error });
    }
});

module.exports = router;

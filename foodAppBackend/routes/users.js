const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
const generateToken = require("../config/jwt");
const rateLimiter = require("../common/rateLimiter");

// Signup API --- One Requset per 1 minute
router.post("/signup", rateLimiter(1000 * 60, 10), async (req, res) => {
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

router.post("/login", rateLimiter(1000 * 60, 15), async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ message: "All Fields are Required" });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: "Phone Number Not Registered." });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password is Wrong." });
        }
        const token = generateToken(user);
        // Login successful
        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                phone: user.phone,
                user_address: user.user_address,
                alt_phone: user.alt_phone
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error });
    }
});

router.post("/edit", rateLimiter(1000 * 60, 10), async (req, res) => {
    try {
        const { user_address, alt_phone, user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ message: "User Id is Required" });
        }

        const updateFields = {};
        if (!!user_address) {
            updateFields.user_address = user_address;
        }
        if (!!alt_phone) {
            updateFields.alt_phone = alt_phone;
        }

        const updatedUser = await User.findByIdAndUpdate(
            user_id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User details updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});

module.exports = router;

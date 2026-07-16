const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Vendor = require("../models/Vendor");
const Order = require("../models/Order");

exports.ordersVendor = async (req, res) => {
    try {
        const { area_id } = req.params;
        if (!area_id) return res.status(400).json({ message: 'Area Id Missing.' });

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            areaId: area_id,
        })
            .populate({
                path: "items.foodId",        // populate foodId first
                populate: { path: "restaurant_id" } // nested populate inside food
            }).lean();

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.loginVendor = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const vendor = await Vendor.findOne({ phone });
        if (!vendor) {
            return res.status(400).json({ message: "Invalid credentials." });
        }
        if (!vendor.status) {
            return res.status(403).json({ message: "Vendor account is disabled." });
        }

        const matched = await bcrypt.compare(password, vendor.password);
        if (!matched) {
            return res.status(400).json({ message: "Password Invalid." });
        }

        const token = jwt.sign(
            {
                vendorId: vendor._id,
                area_id: vendor.area_id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.json({
            token,
            vendor: {
                id: vendor._id,
                name: vendor.name,
                phone: vendor.phone,
                area_id: vendor.area_id,
            },
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error." });
    }
};

// Create Vendor
exports.createVendor = async (req, res) => {
    try {
        const { name, phone, password, area_id, status } = req.body;
        if (!name || !phone || !password || !area_id) {
            return res.status(400).json({ message: "All required fields are mandatory." });
        }
        if (!mongoose.Types.ObjectId.isValid(area_id)) {
            return res.status(400).json({ message: "Invalid area id." });
        }

        const exists = await Vendor.findOne({ phone });
        if (exists) {
            return res.status(400).json({ message: "Phone already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const vendor = await Vendor.create({
            name,
            phone,
            password: hashedPassword,
            area_id,
            status,
        });

        res.status(201).json({
            message: "Vendor created successfully.",
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error.", err });
    }
};

// Get All Vendors
exports.getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find()
            .sort({ createdAt: -1 })
            .populate("area_id", "name code")
            .lean();

        res.status(200).json(vendors);
    } catch (err) {
        res.status(500).json({ message: "Server Error." });
    }
};

// Get Vendor By Id
exports.getVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id)
            .populate("area_id", "name code");

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        res.json(vendor);

    } catch (err) {
        res.status(500).json({ message: "Server Error." });
    }
};

// Update Vendor
exports.updateVendor = async (req, res) => {
    try {

        const { name, phone, password, area_id, status } = req.body;

        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        if (phone && phone !== vendor.phone) {
            const exists = await Vendor.findOne({ phone });

            if (exists) {
                return res.status(400).json({ message: "Phone already exists." });
            }
            vendor.phone = phone;
        }

        if (password) {
            vendor.password = await bcrypt.hash(password, 10);
        }

        vendor.name = name ?? vendor.name;
        vendor.area_id = area_id ?? vendor.area_id;
        vendor.status = status ?? vendor.status;

        await vendor.save();

        res.json({
            message: "Vendor updated successfully.",
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error.", err });
    }
};

// Delete Vendor
exports.deleteVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        await vendor.deleteOne();

        res.json({
            message: "Vendor deleted successfully."
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error." });
    }
};
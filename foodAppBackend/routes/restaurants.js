const express = require("express");
const router = express.Router();
const commonController = require("../controllers/commonController");
const rateLimiter = require("../common/rateLimiter");
const Restaurant = require("../models/Restaurant");
const mongoose = require("mongoose");

// Get all restaurants
router.get("/", rateLimiter(1000 * 60, 30), async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ status: true }).lean();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

router.get("/by-area-code/grouped/:area_id", rateLimiter(1000 * 60, 30), async (req, res) => {
    try {
        const areaId = req.params.area_id;
        if (!areaId) return res.status(400).json({ message: 'AreaId is Required.' });
        const [result] = await Restaurant.aggregate([
            {
                $match: {
                    status: true,
                    $or: [
                        { area_id: new mongoose.Types.ObjectId(areaId) },
                        { area_id: null }
                    ],
                }
            },
            {
                $facet: {
                    banners: [
                        { $match: { is_banner: true } },
                        { $sort: { sort_order: 1 } },
                        { $project: { name: 1, image_url: 1 } },
                    ],
                    categories: [
                        { $match: { is_banner: false } },
                        { $sort: { sort_order: 1 } },
                        { $project: { name: 1, image_url: 1 } },
                    ],
                },
            },
        ]);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

module.exports = router;

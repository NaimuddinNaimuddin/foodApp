const express = require("express");
const router = express.Router();
const commonController = require("../controllers/commonController");
const rateLimiter = require("../common/rateLimiter");
// Get all restaurants
router.get("/", rateLimiter(1000 * 60, 30), async (req, res) => {
    const restaurants = await Restaurant.find({ status: 'ACTIVE' });
    res.json(restaurants);
});

router.get("/by-area-code/grouped/:area_code", rateLimiter(1000 * 60, 30), async (req, res) => {
    try {
        const areaCode = req.params.area_code;
        if (!areaCode) return res.status(400).json({ message: 'Area Code is Required.' });

        const result = await Category.aggregate([
            { $match: { status: true, area_code: { $in: [areaCode, "0"] }, } },
            {
                $facet: {
                    banners: [
                        { $match: { isBanner: true } },
                        { $sort: { sort_order: 1 } },
                        { $project: { name: 1, image_url: 1 } },
                    ],
                    categories: [
                        { $match: { isBanner: false } },
                        { $sort: { sort_order: 1 } },
                        { $project: { name: 1, image_url: 1 } },
                    ],
                },
            },
        ]);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;

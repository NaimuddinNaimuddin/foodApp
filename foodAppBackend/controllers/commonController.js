const Area = require("../models/Area");
const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");
const mongoose = require("mongoose");

const getArea = async (req, res) => {
    try {
        const areas = await Area.find({ status: true }).lean();
        res.status(200).json(areas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getFoodItemsGroupedByCategory = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Bad Request." })
        }
        const groupedItems = await Food.aggregate([
            {
                $match: {
                    restaurant_id: new mongoose.Types.ObjectId(req.params.id),
                    status: true,
                },
            },
            {
                $group: {
                    _id: "$category",
                    items: { $push: "$$ROOT" },
                },
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    items: 1,
                },
            },
        ]);
        res.status(200).json(groupedItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().lean();
        res.status(200).json(restaurants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getArea,
    getAllRestaurants,
    getFoodItemsGroupedByCategory,
};

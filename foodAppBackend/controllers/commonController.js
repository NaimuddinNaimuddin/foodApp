const Area = require("../models/Area");
const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");
const mongoose = require("mongoose");
const Order = require("../models/Order");

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status, status_reason = '' } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({
                success: false,
                message: "orderId and status are required.",
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        order.status = status;
        if (status_reason) {
            order.status_reason = status_reason;
        }
        await order.save();

        return res.status(200).json({
            message: "Order Status Updated.",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error.", error
        });
    }
};

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

const updateFoodStockStatus = async (req, res) => {
    try {
        const { foodId, inStockStatus } = req.body;
        if (!foodId) {
            return res.status(400).json({ message: "Bad Request." });
        }
        const foodItem = await Food.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({ message: "Food Not Found." });
        }

        foodItem.in_stock = inStockStatus;
        await foodItem.save();

        return res.status(200).json({
            message: "Food Item status updated.",
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getArea,
    getAllRestaurants,
    getFoodItemsGroupedByCategory,
    updateOrderStatus,
    updateFoodStockStatus
};

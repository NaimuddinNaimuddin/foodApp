const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Food = require("../models/Food");
const { notifyNewOrder } = require("../common/sse");
const rateLimiter = require("../common/rateLimiter");

router.post("/place", rateLimiter(1000 * 60, 20), async (req, res) => {
    const { userId, items, areaId, deliveryAddress, paymentMethod = 'COD' } = req.body;

    if (!areaId || !userId || !items || !items.length || !deliveryAddress) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        let total = 0;
        const _items = await Promise.all(
            items.filter(async (item) => !!item.foodId).map(async (item) => {
                const food = await Food.findById(item.foodId);
                total += (!!(food && food._id) ? food.price : 0) * item.quantity;

                return {
                    foodId: (!!food && food._id) ? food._id : '',
                    name: (!!food && food.name) ? food.name : '',
                    image_url: (!!food && food.image_url) ? food.image_url : '',
                    price: (!!food && food.price) ? food.price : 0,
                    quantity: item.quantity ? item.quantity : 1,
                };
            })
        );

        const order = new Order({
            userId,
            areaId,
            items: _items,
            totalAmount: total,
            deliveryAddress,
            paymentMethod,
        });

        await order.save();
        // Notify all admin dashboards
        notifyNewOrder(order);
        await Cart.deleteOne({ userId });
        res.status(201).json({ message: "Order placed successfully", order });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get("/:userId", rateLimiter(1000 * 60, 30), async (req, res) => {
    try {
        const { userId } = req.params;
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            userId,
        }).populate({
            path: "items.foodId",        // populate foodId first
            populate: { path: "restaurant_id" } // nested populate inside food
        });

        if (!orders || !orders.length) return res.status(404).json({ message: "No orders found" });

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

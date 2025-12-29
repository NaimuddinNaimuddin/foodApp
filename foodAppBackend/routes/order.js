const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");

router.post("/place", async (req, res) => {
    const { userId, items, deliveryAddress, paymentMethod = 'COD' } = req.body;

    if (!userId || !items || !items.length || !deliveryAddress) {
        return res.status(400).json({ message: "All fields are required" });
    }
    console.log(req.body);

    try {
        const totalAmount = items.reduce((sum, item) => sum + item.foodId.price * item.quantity, 0);

        const order = new Order({
            userId,
            items,
            totalAmount,
            deliveryAddress,
            paymentMethod,
        });

        await order.save();

        await Cart.deleteOne({ userId });

        res.status(201).json({ message: "Order placed successfully", order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId })
            .populate({
                path: "items.foodId",        // populate foodId first
                populate: { path: "restaurant" } // nested populate inside food
            });

        if (!orders || !orders.length) return res.status(404).json({ message: "No orders found" });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

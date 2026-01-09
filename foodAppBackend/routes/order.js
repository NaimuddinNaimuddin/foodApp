const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Food = require("../models/Food");

router.post("/place", async (req, res) => {
    const { userId, items, deliveryAddress, paymentMethod = 'COD' } = req.body;

    if (!userId || !items || !items.length || !deliveryAddress) {
        return res.status(400).json({ message: "All fields are required" });
    }
    console.log(req.body);

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
            items: _items,
            totalAmount: total,
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
                populate: { path: "restaurant_id" } // nested populate inside food
            });

        if (!orders || !orders.length) return res.status(404).json({ message: "No orders found" });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

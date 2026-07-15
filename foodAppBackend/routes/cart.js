const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const rateLimiter = require("../common/rateLimiter");

// Add to cart
router.post("/add", rateLimiter(1000 * 60, 30), async (req, res) => {
    const { userId, areaId, foodId } = req.body;

    let cart = await Cart.findOne({ userId, areaId });
    if (!cart) {
        cart = new Cart({ userId, areaId, items: [] });
    }
    const item = cart.items.find(i => i.foodId.equals(foodId));

    if (item) {
        item.quantity += 1;
    } else {
        cart.items.push({ foodId, quantity: 1 });
    }

    await cart.save();
    res.json({ message: "Added to cart", cart });
});

// remove from cart
router.delete("/remove/:userId/:areaId/:productId", rateLimiter(1000 * 60, 30), async (req, res) => {
    const { userId, areaId, productId } = req.params;
    try {
        const cart = await Cart.findOne({ userId, areaId })
        if (!cart) return res.status(404).send("Cart Not Found");
        cart.items = cart.items.filter(i => i.foodId.toString() !== productId);

        await cart.save();
        const cartReturn = await Cart.findOne({ userId, areaId }).populate("items.foodId");

        res.json(cartReturn);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// decrease count 
router.put("/decrease/:userId/:areaId/:productId", rateLimiter(1000 * 60, 30), async (req, res) => {
    const { userId, areaId, productId } = req.params;

    try {
        const cart = await Cart.findOne({ userId, areaId });
        if (!cart) return res.status(404).send("Cart not found");

        const item = cart.items.find(i => i.foodId.toString() === productId);
        if (!item) return res.status(404).send("Item not found");

        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            // Remove item if quantity becomes 0
            cart.items = cart.items.filter(i => i.foodId.toString() !== productId);
        }

        await cart.save();

        const cartReturn = await Cart.findOne({ userId, areaId }).populate("items.foodId");
        res.json(cartReturn);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put("/increase/:userId/:areaId/:productId", rateLimiter(1000 * 60, 30), async (req, res) => {
    const { userId, areaId, productId } = req.params;

    try {
        await Cart.updateOne(
            { userId, areaId, "items.foodId": productId },
            { $inc: { "items.$.quantity": 1 } }
        );

        const cart = await Cart.findOne({ userId, areaId }).populate("items.foodId");
        res.json(cart);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// get cart 
router.get("/:userId/:areaId", rateLimiter(1000 * 60, 100), async (req, res) => {
    const { userId, areaId } = req.params;
    try {
        const cart = await Cart.findOne({ userId, areaId }).populate("items.foodId");
        if (!cart) return res.status(200).json({ items: [] });
        // ✅ remove items where foodId is null
        cart.items = cart.items.filter(item => item.foodId !== null);
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
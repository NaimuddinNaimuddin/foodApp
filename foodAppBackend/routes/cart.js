const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const FoodItem = require("../models/FoodItem");
const Cart = require("../models/Cart");

// Add to cart
router.post("/add", async (req, res) => {
    const { userId, foodId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = new Cart({ userId, items: [] });
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

// get cart 
router.get("/:userId", async (req, res) => {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.foodId");
    res.json(cart);
});

// remove from cart
router.delete("/remove/:userId/:productId", async (req, res) => {
    const { userId, productId } = req.params;
    console.log({ userId, productId })
    try {
        const cart = await Cart.findOne({ userId })
        if (!cart) return res.status(404).send("Cart not found");
        console.log(JSON.stringify({ cart }))
        cart.items = cart.items.filter(i => i.foodId.toString() !== productId);
        console.log(JSON.stringify(cart.items))

        await cart.save();
        console.log(JSON.stringify({ cart }))
        const cartReturn = await Cart.findOne({ userId }).populate("items.foodId");

        res.json(cartReturn);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// decrease count 
router.put("/decrease/:userId/:productId", async (req, res) => {
    const { userId, productId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });
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

        const cartReturn = await Cart.findOne({ userId }).populate("items.foodId");
        res.json(cartReturn);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put("/increase/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;

  try {
    await Cart.updateOne(
      { userId, "items.foodId": productId },
      { $inc: { "items.$.quantity": 1 } }
    );

    const cart = await Cart.findOne({ userId }).populate("items.foodId");
    res.json(cart);

  } catch (err) {
    res.status(500).send(err.message);
  }
});


module.exports = router;
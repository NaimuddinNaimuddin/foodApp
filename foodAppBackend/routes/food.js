const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Food = require("../models/Food");
const cloudinary = require("../config/cloudinary");

// Add Food Item to a Restaurant
router.post("/food-items", async (req, res) => {
    try {
        const { restaurant_id, name, price, mrp, quantity_info, category, short_desc, long_desc, image_url, image_id } = req.body;
        console.log({ restaurant_id, name, price, mrp, quantity_info, category, short_desc, long_desc, image_url, image_id });
        if (!restaurant_id || !name || !price || !mrp || !quantity_info || !category) return res.status(400).json({ error: "Bad Request." });

        const foodItem = await Food.create({
            restaurant_id,
            name,
            price,
            mrp,
            quantity_info,
            category,
            short_desc,
            long_desc,
            image_url,
            image_id,
        });

        res.status(201).json(foodItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get Restaurant with Its Food Items
router.get("/food-items/:id", async (req, res) => {
    const item = await Food.findById(req.params.id);
    res.json(item);
});

// Get food items for restaurant
router.get("/:id/food-items", async (req, res) => {
    try {
        const groupedItems = await Food.aggregate([
            {
                $match: {
                    restaurant_id: new mongoose.Types.ObjectId(req.params.id),
                    is_available: true,
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
});

router.put("/food-items/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            restaurant_id,
            name,
            price,
            mrp,
            quantity_info,
            category,
            short_desc,
            long_desc,
            image_url,
            image_id,
        } = req.body;

        if (!restaurant_id || !name || !price || !mrp || !quantity_info || !category) {
            return res.status(400).json({ error: "Bad Request" });
        }

        const food = await Food.findById(id);
        if (!food) return res.status(404).json({ error: "Food item not found" });

        // Delete old image if replaced
        if (image_id && food.image_id && image_id !== food.image_id) {
            await cloudinary.uploader.destroy(food.image_id);
        }

        food.restaurant_id = restaurant_id;
        food.name = name;
        food.price = price;
        food.mrp = mrp;
        food.quantity_info = quantity_info;
        food.category = category;
        food.short_desc = short_desc;
        food.long_desc = long_desc;
        food.image_url = image_url;
        food.image_id = image_id;

        await food.save();
        res.json(food);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;

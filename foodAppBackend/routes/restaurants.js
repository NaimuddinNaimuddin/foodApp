const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const FoodItem = require("../models/FoodItem");
const Cart = require("../models/Cart");

// Add a restaurant
router.post("/", async (req, res) => {
  try {
    const { name, latitude, longitude, image_url } = req.body;
    console.log({ name, latitude, longitude, image_url });
    const restaurant = new Restaurant({
      name,
      image_url,
      location: {
        type: "Point",
        coordinates: [longitude, latitude]
      }
    });

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all restaurants
router.get("/", async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
});

// Add Food Item to a Restaurant
router.post("/food-items", async (req, res) => {
  try {
    const { name, price, image_url, restaurantId, category } = req.body;
    console.log({ name, price, image_url, restaurantId, category });
    if (!restaurantId) return res.status(400).json({ error: "Restaurant ID required" });

    const foodItem = await FoodItem.create({
      name,
      price,
      category,
      image_url,
      restaurant: restaurantId,
    });

    res.status(201).json(foodItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get Restaurant with Its Food Items
router.get("/:id/food-items", async (req, res) => {
  const items = await FoodItem.find({ restaurant: req.params.id });
  res.json(items);
});

module.exports = router;

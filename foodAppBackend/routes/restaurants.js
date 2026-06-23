const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const Food = require("../models/Food");
const cloudinary = require("../config/cloudinary");

// Add a restaurant
router.post("/", async (req, res) => {
  try {
    const { name, image_url } = req.body;
    console.log({ name, image_url });
    const restaurant = new Restaurant({
      name,
      image_url,
      // location: {
      //   type: "Point",
      //   coordinates: [longitude, latitude]
      // }
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

    const foodItem = await Food.create({
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

// Get Restaurant by id
router.get("/:id", async (req, res) => {
  const items = await Restaurant.findById(req.params.id);
  res.json(items);
});

// PUT /restaurants/edit/:id
router.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      address,
      status,
      image_url,
      image_id,
      // latitude,
      // longitude
    } = req.body;

    // Validation
    if (!name || !category || !address || !status) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // Find restaurant
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Delete old image if replaced
    if (image_url && image_url !== restaurant.image_url) {
      if (restaurant.image_id) {
        await cloudinary.uploader.destroy(restaurant.image_id);
      }
    }

    // Update fields
    restaurant.name = name;
    restaurant.category = category;
    restaurant.address = address;
    restaurant.status = status;
    restaurant.image_url = image_url || restaurant.image_url;
    restaurant.image_id = image_id || restaurant.image_id;
    // restaurant.latitude = latitude || restaurant.latitude;
    // restaurant.longitude = longitude || restaurant.longitude;

    await restaurant.save();

    res.status(200).json({ message: "Restaurant updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

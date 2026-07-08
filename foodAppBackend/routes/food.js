const express = require("express");
const router = express.Router();
const commonController = require("../controllers/commonController");
const rateLimiter = require("../common/rateLimiter");

// Get food items for restaurant
router.get("/list/:restaurantId", rateLimiter(1000 * 60, 40), commonController.getFoodItemsGroupedByCategory);

module.exports = router;

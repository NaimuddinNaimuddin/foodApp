const express = require("express");
const router = express.Router();
const commonController = require("../controllers/commonController");
const rateLimiter = require("../common/rateLimiter");
// Get all restaurants
router.get("/", rateLimiter(1000 * 60, 30), commonController.getAllRestaurants);

module.exports = router;

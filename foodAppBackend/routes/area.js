const express = require("express");
const router = express.Router();
const commonController = require("../controllers/commonController");
const rateLimiter = require("../common/rateLimiter");

router.get("/all", rateLimiter(1000 * 60, 30), commonController.getArea);

module.exports = router;

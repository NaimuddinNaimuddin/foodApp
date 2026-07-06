const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const commonController = require("../controllers/commonController");

router.post("/area/add", adminController.addArea);
router.get("/area/all", commonController.getArea);

router.get("/restaurants/:id", adminController.getRestaurantById);
router.get("/restaurants", commonController.getAllRestaurants);
router.post("/restaurants", adminController.addRestaurants);
router.put("/restaurants/:id", adminController.editCategoryById);

router.get("/food/food-items/:id", adminController.getFoodItemsById);
router.put("/food/food-items/:id", adminController.editFoodItems);
router.get("/food/:id/food-items", commonController.getFoodItemsGroupedByCategory);
router.post("/food/food-items", adminController.addFoodItems);

router.get("/orders/all", adminController.getAllOrders);

module.exports = router;

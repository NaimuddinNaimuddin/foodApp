const express = require("express");
const router = express.Router();

const {
    createVendor,
    getVendors,
    getVendor,
    updateVendor,
    deleteVendor,
    loginVendor,
    ordersVendor,
} = require("../controllers/vendorController");
const { updateOrderStatus } = require("../controllers/commonController");

router.get("/:id", getVendor);
router.get("/", getVendors);
router.post("/", createVendor);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);

router.post("/login", loginVendor);
router.get("/orders/:area_id", ordersVendor);
router.patch("/order-status", updateOrderStatus);

module.exports = router;
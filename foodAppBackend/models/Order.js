const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem", required: true },
    quantity: { type: Number, required: true, default: 1 },
    // price: { type: Number, required: true }, // store price at order time
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    paymentMethod: { type: String, enum: ["COD", "Online"], default: "COD" },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Preparing", "Delivered", "Cancelled"],
        default: "Pending",
    },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);

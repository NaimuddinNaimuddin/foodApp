const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: String, // later from auth
  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" },
      quantity: Number
    }
  ]
});

module.exports = mongoose.model("Cart", cartSchema);

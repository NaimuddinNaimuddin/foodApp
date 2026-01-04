const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId, // later from auth
  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
      quantity: Number
    }
  ]
});

module.exports = mongoose.model("Cart", cartSchema);

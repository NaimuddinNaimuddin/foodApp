const mongoose = require("mongoose");

const FoodItemSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: Number,
  category: String,
  image_url: String,
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("FoodItem", FoodItemSchema);

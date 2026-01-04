const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
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
  image_url: {
    type: String,
    default: 'https://res.cloudinary.com/naimucloudinary/image/upload/v1767041768/food_kyeqm9.png',
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Food", FoodSchema);

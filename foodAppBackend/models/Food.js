const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true,
  },
  area_id: {
    type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true,
  },
  name: {
    type: String, required: true,
  },
  price: {
    type: Number, required: true
  },
  mrp: {
    type: Number, required: true
  },
  quantity_info: {
    type: String, required: true
  },
  category: {
    type: String, required: true
  },
  short_desc: String,
  long_desc: String,
  image_url: {
    type: String,
    default: 'https://res.cloudinary.com/naimucloudinary/image/upload/v1767041768/food_kyeqm9.png',
  },
  image_id: {
    type: String,
  },
  is_in_stock: {
    type: Boolean,
    default: false,
  },
  sort_order: {
    type: Number,
    default: 0
  },
  status: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Food", schema);

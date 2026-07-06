const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image_id: {
    type: String,
  },
  image_url: {
    type: String,
  },
  category: {
    type: String,
    default: null,
  },
  area_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Area",
    default: null,
  },
  is_banner: {
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

schema.index({ is_banner: 1, sort_order: 1 });

module.exports = mongoose.model("Restaurant", schema);

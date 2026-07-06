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
  type: {
    type: String,
    required: true,
    default: 'Food'
  },
  area_code: {
    type: String,
    default: '0',
    index: true,
  },
  isBanner: {
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

schema.index({ area_code: 1, isBanner: 1, sort_order: 1 });

module.exports = mongoose.model("Restaurant", schema);

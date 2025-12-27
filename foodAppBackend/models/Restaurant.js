const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  image_url: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    default: 'Food'
  },
  ratings: {
    type: Number,
    default: 5,
  },
  address: {
    type: String,
  },
  status: {
    type: String,
    default: 'open',
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Required for geospatial queries
RestaurantSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Restaurant", RestaurantSchema);

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const restaurantRoutes = require("./routes/restaurants");
const userRoutes = require("./routes/users");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/restaurants", restaurantRoutes);
app.use("/users", userRoutes);
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const restaurantRoutes = require("./routes/restaurants");
const userRoutes = require("./routes/users");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const foodRoutes = require("./routes/food");
const areaRoutes = require("./routes/area");
const policyRoutes = require("./routes/policy");
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");

const sse = require("./routes/sse");
const ipBackstopLimiter = require("./common/ipLimiter");
const adminBackstopLimiter = require("./common/adminLimiter");

const app = express();

app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());

app.use("/admin", adminBackstopLimiter);
app.use("/vendor", adminBackstopLimiter);
app.use(ipBackstopLimiter);

app.use("/stream", sse);

app.use("/admin", adminRoutes);
app.use("/vendor", vendorRoutes);

app.use("/users", userRoutes);
app.use("/area", areaRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/food", foodRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/", policyRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    maxPoolSize: 20,
    minPoolSize: 5
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

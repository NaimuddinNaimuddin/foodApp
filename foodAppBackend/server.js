require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const helmet = require("helmet");
const errorHandler = require("./config/errorHandler");

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
app.use(helmet());
// app.use(compression());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/stream", sse);
app.use("/admin", adminBackstopLimiter);
app.use("/vendor", adminBackstopLimiter);
app.use(ipBackstopLimiter);

app.use("/admin", adminRoutes);
app.use("/vendor", vendorRoutes);

app.use("/users", userRoutes);
app.use("/area", areaRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/food", foodRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/", policyRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 20,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
startServer();

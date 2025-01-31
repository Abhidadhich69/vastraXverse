require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const util = require("util");
const bodyParser = require("body-parser");  // Import body-parser
const unlinkAsync = util.promisify(fs.unlink);
const checkoutRoute = require("./routes/shop/checkout-routes");  // Import the checkout routes
const connectDB = require("./utils/connectDB");
const User = require("./models/User");
const FeatureImage = require("./models/FeatureImage");
const Order = require("./models/Order"); // Assuming you have an Order model

// Import routes
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const paymentRoutes = require('./routes/payment-routes');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(bodyParser.json()); // Middleware for parsing JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Middleware for parsing URL-encoded requests

// CORS setup
const corsOptions = {
  origin: process.env.NODE_ENV === "production" ? "https://your-frontend-domain.com" : "http://localhost:5173",
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "Expires",
    "Pragma",
  ],
  credentials: true,
};
app.use(cors({ origin: "https://vastra-xverse.vercel.app/", credentials: true }));
app.use(cors(corsOptions));

// Preflight request handling for CORS
app.options("*", cors(corsOptions));  // Preflight request handling for all routes

// API routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/checkout", checkoutRoute);
app.use('/api/payment', paymentRoutes);
// Feature Image Routes
// Fetch all feature images
app.get("/api/feature-images", async (req, res) => {
  try {
    const images = await FeatureImage.find();
    res.json({ success: true, images });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ success: false, message: "Error fetching images" });
  }
});

// Add a new feature image
app.post("/api/feature-images", async (req, res) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ success: false, message: "Image URL is required" });
  }

  try {
    const newImage = new FeatureImage({ image });
    await newImage.save();
    res.json({ success: true, image: newImage });
  } catch (error) {
    console.error("Error adding image:", error);
    res.status(500).json({ success: false, message: "Error adding image" });
  }
});

// Delete a feature image by ID
app.delete("/api/feature-images/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedImage = await FeatureImage.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    // If there is an associated file, remove it from the server
    const imagePath = path.join(__dirname, "uploads", deletedImage.filename);
    try {
      await unlinkAsync(imagePath);
      res.json({ success: true, message: "Image deleted successfully" });
    } catch (fileError) {
      console.error("Error deleting image file:", fileError);
      return res.status(500).json({
        success: false,
        message: "Image metadata deleted, but file removal failed",
      });
    }
  } catch (error) {
    console.error("Error deleting image record:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting image record",
    });
  }
});

// Order creation route
app.post("/api/orders/create-order", async (req, res) => {
  try {
    const { userId, cartItems, totalAmount, addressInfo } = req.body;

    // Simulate order creation logic
    const razorpayOrderId = "order_" + Date.now(); // Generate a sample order ID

    // Return a JSON response
    res.status(200).json({
      success: true,
      razorpayOrderId,
      totalAmount,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// Logging incoming requests for debugging
app.use((req, res, next) => {
  console.log(req.method, req.url);
  console.log("Request body:", req.body); // Log the request body for debugging
  next();
});

// Connect to the database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);
  });
});

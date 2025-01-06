require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const User = require("./models/User");
const connectDB = require("./utils/connectDB");
const FeatureImage = require("./models/FeatureImage");

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

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

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

// Connect to the database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);

    async function Main() {
      console.log("started");
      const adminEmails = [
        "sharmaabhi72005@gmail.com",
        "lucistar0705@gmail.com",
        "vastraxverse@gmail.com",
      ];

      await User.updateMany(
        {
          email: { $in: adminEmails }, // Match any email in the array
        },
        {
          $set: { role: "admin" }, // Update the role to 'admin'
        }
      );

      console.log("ended");
    }

    Main();
  });
});

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
    res.json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ success: false, message: "Error deleting image" });
  }
});

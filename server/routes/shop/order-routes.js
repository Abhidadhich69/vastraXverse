const express = require("express");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

// Create order and handle payment initiation
router.post("/create", async (req, res) => {
  try {
    const order = await createOrder(req, res);
    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while creating the order",
      error: error.message,
    });
  }
});

// Capture payment after user approval
router.post("/capture", async (req, res) => {
  try {
    const paymentDetails = await capturePayment(req, res);
    res.status(200).json({
      success: true,
      paymentDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error capturing the payment",
      error: error.message,
    });
  }
});

// Get all orders by user
router.get("/list/:userId", async (req, res) => {
  try {
    const orders = await getAllOrdersByUser(req.params.userId);
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
});

// Get order details by order ID
router.get("/details/:id", async (req, res) => {
  try {
    const order = await getOrderDetails(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: error.message,
    });
  }
});

module.exports = router;

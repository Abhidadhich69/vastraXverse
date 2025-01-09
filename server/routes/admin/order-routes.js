const express = require("express");
const {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

// Route for creating a new order
router.post("/create-order", createOrder);

// Route for capturing a payment
router.post("/capture-payment", capturePayment);

// Route for getting all orders of a user
router.get("/user-orders/:userId", getAllOrdersByUser);

// Route for getting details of a specific order
router.get("/order-details/:id", getOrderDetails);

module.exports = router;

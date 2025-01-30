const Razorpay = require("razorpay");
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const Cart = require("../../models/Cart");
require("dotenv").config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      totalAmount,
      cartId,
      paymentMethod = "Online",
      paymentStatus = "Pending",
      orderStatus = "Pending",
    } = req.body;

    // Validate total amount
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid total amount" });
    }

    // Ensure the amount is not below the minimum threshold (Razorpay's minimum is typically ₹1)
    if (totalAmount < 1) {
      return res.status(400).json({ success: false, message: "Order amount must be at least ₹1" });
    }

    // Prepare Razorpay order options
    const orderOptions = {
      amount: totalAmount * 100, // Convert to paise (Razorpay expects amount in paise)
      currency: "INR",
      receipt: `receipt_${cartId}`,
      notes: { cartId },
    };

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create(orderOptions);

    if (!razorpayOrder || !razorpayOrder.id) {
      return res.status(500).json({
        success: false,
        message: "Failed to create Razorpay order",
      });
    }

    // Save order in the database
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      totalAmount,
      orderStatus,
      paymentMethod,
      paymentStatus,
      razorpayOrderId: razorpayOrder.id,
      orderDate: new Date(),
    });

    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      orderId: newlyCreatedOrder._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Error while creating order" });
  }
};


// Capture a payment
const capturePayment = async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Update order payment status
    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";
    order.paymentId = paymentId;

    // Reduce stock for ordered products
    for (const item of order.cartItems) {
      const product = await Product.findById(item.productId);
      if (product && product.totalStock >= item.quantity) {
        product.totalStock -= item.quantity;
        await product.save();
      } else {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product ${item.title}`,
        });
      }
    }

    // Remove the cart after successful payment
    await Cart.findByIdAndDelete(order.cartId);

    await order.save();

    res.status(200).json({ success: true, message: "Payment captured and order confirmed", order });
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.status(500).json({ success: false, message: "Error capturing payment" });
  }
};

// Get all orders by a user
const getAllOrdersByUser = async (req, res) => {
  try {
    console.log("req.params:", req.params);
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found for this user" });
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// Get order details
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ success: false, message: "Error fetching order details" });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};

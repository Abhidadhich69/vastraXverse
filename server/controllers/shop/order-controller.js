const Razorpay = require('razorpay');
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,  // Your Razorpay key ID from environment variables
  key_secret: process.env.RAZORPAY_KEY_SECRET,  // Your Razorpay key secret from environment variables
});

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    // Prepare payment object
    const create_payment_json = {
      amount: totalAmount * 100, // Amount in paise for INR (₹100 = 10000 paise)
      currency: "INR",  // Currency in INR for India-based transactions
      payment_capture: 1, // Capture payment immediately
      notes: {
        orderId: cartId,  // Store cart ID as a note
      },
      order_id: "order_rcptid_" + new Date().getTime(),  // Generate unique order ID
      description: "Your purchase from our shop",  // Description of the transaction
      item_list: {
        items: cartItems.map((item) => ({
          name: item.title,
          sku: item.productId,
          price: item.price.toFixed(2), // Ensure price is formatted as a string
          currency: "INR",
          quantity: item.quantity,
        })),
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/razorpay-return",  // URL after successful payment
        cancel_url: "http://localhost:5173/shop/razorpay-cancel",  // URL after canceled payment
      }
    };

    // Call Razorpay API to create payment
    razorpay.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error("Error creating Razorpay payment:", error);
        return res.status(500).json({
          success: false,
          message: "Error while creating Razorpay payment",
        });
      } else {
        // Log Razorpay payment info for debugging
        console.log("Razorpay payment info:", paymentInfo);

        // Create a new order document in the database
        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });

        // Save the order to the database
        await newlyCreatedOrder.save();

        // Find approval URL from Razorpay response
        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        // Send response with success status and approval URL
        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (e) {
    console.error("Error occurred while creating order:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    // Update product stock after payment
    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    // Delete cart after successful payment
    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    // Save the updated order document
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};

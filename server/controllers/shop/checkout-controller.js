require("dotenv").config(); // Load environment variables from .env file
const axios = require("axios");

const createCheckout = async (req, res) => {
  const data = {
    amount: 20000, // In paise (INR)
    currency: "INR",
    order_id: "order_1736446750102", // Your generated order ID
    key_id: process.env.RAZORPAY_KEY_ID, // Retrieve key_id from environment variable
    session_token: "your_session_token", // Pass session token dynamically or store it in req.body
  };

  try {
    const response = await axios.post(
      "https://api.razorpay.com/v2/standard_checkout/preferences",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            process.env.RAZORPAY_KEY_ID + ":"
          ).toString("base64")}`,
        },
      }
    );
    res.json(response.data); // Send the response back to frontend
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data || error.message;

    console.error("Error creating checkout session:", errorMessage);

    res.status(statusCode).json({
      success: false,
      message: "Failed to create checkout session",
      error: errorMessage,
    });
  }
};

module.exports = { createCheckout };

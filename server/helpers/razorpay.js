const Razorpay = require("razorpay");
require("dotenv").config(); // Load environment variables

// Configure Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async () => {
    const options = {
        amount: 50000, // Amount in the smallest currency unit (50000 paise = ₹500)
        currency: "INR",
        receipt: "order_rcptid_11",
        payment_capture: 1, // Automatically capture payment
    };

    try {
        console.log("Creating order with options:", options);
        const order = await razorpay.orders.create(options);
        console.log("Order Created Successfully:", order);
        return order;
    } catch (error) {
        if (error.response) {
            console.error("API Response Error:", error.response.data);
        } else if (error.request) {
            console.error("No Response Received:", error.request);
        } else {
            console.error("General Error:", error.message);
        }
        throw error;
    }
};

// Execute and catch unhandled errors
(async () => {
    try {
        const order = await createOrder();
        console.log("Order ID:", order.id); // Print the Order ID after creation
    } catch (error) {
        console.error("Unhandled Error:", error);
    }
})();

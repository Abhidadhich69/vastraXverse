const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate input
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find or create a cart for the user
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the product is already in the cart
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      // If product not found, add it to the cart
      cart.items.push({
        product: productId,
        title: product.title,
        price: product.price,
        quantity,
      });
    } else {
      // If product found, update the quantity
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    // Save the cart
    await cart.save();

    // Return updated cart
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is mandatory!",
      });
    }

    // Fetch cart with populated product details
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "image title price salePrice",
    });

    // Check if cart exists
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Remove invalid items (products that no longer exist)
    const validItems = cart.items.filter((item) => item.product);

    if (validItems.length < cart.items.length) {
      // Update cart if there are invalid items
      cart.items = validItems;
      await cart.save();
    }

    // Format the response
    const populatedCartItems = validItems.map((item) => ({
      productId: item.product._id,
      image: item.product.image,
      title: item.product.title,
      price: item.product.price,
      salePrice: item.product.salePrice,
      quantity: item.quantity,
    }));

    // Return the updated cart
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatedCartItems,
      },
    });
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
    });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate input
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Find the product in the cart
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    // If product not found, return error
    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present!",
      });
    }

    // Update the quantity of the product
    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    // Populate cart with product details
    await cart.populate({
      path: "items.product",
      select: "image title price salePrice",
    });

    // Format the response
    const populatedCartItems = cart.items.map((item) => ({
      productId: item.product._id,
      image: item.product.image,
      title: item.product.title,
      price: item.product.price,
      salePrice: item.product.salePrice,
      quantity: item.quantity,
    }));

    // Return updated cart
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatedCartItems,
      },
    });
  } catch (error) {
    console.error("Update Cart Item Quantity Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating cart item quantity",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Validate input
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(
      (item) => item.product._id.toString() !== productId
    );

    await cart.save();

    // Format the response
    const populatedCartItems = cart.items.map((item) => ({
      productId: item.product._id,
      image: item.product.image,
      title: item.product.title,
      price: item.product.price,
      salePrice: item.product.salePrice,
      quantity: item.quantity,
    }));

    // Return the updated cart
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatedCartItems,
      },
    });
  } catch (error) {
    console.error("Delete Cart Item Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting cart item",
    });
  }
};

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};

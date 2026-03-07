const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

const jwt = require("jsonwebtoken");

const addCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity)
      return res.status(404).json({ msg: "Missing Data" });

    // const authHeader = req.headers.authorization;

    // const token = authHeader.split(" ")[1];

    // const docecodToken = jwt.verify(token, process.env.JWT_SCKRET);

    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ msg: "User Not Found" });

    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ msg: "Product Not Found" });

    if (quantity > product.stock) return res.json({ msg: "Your Order Large" });

    // Cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) cart = await Cart.create({ user: userId, items: [] });

    const indexItem = cart.items.findIndex((item) => {
      item.product.equals(productId);
    });

    if (indexItem > -1) cart.items[indexItem].quantity += quantity;
    else cart.items.push({ product: productId, quantity });

    await cart.save();
    product.stock -= quantity;
    await product.save();

    res.json({
      data: cart,
    });
  } catch (error) {
    console.log(error);
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    res.json({
      data: cart,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addCart,
  getCart,
};

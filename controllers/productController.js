const Product = require("../models/Product");
const User = require("../models/User");

const addProductSchema = require("./validation/productValidation");

const addProductController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "Please Add Image" });

    const { error, value } = addProductSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        msg: error.details.map((err) => err.message),
      });
    }
    // Get Data From req.body
    const { name, price, stock } = value;

    const userId = req.user.id;
    // Validation Data
    // if (!name || !price || !stock)
    //   return res.status(404).json({ msg: "Missing Data" });
    // Check Admin Role
    const checkAdmin = await User.findById(userId);

    if (!checkAdmin) return res.status(404).json({ msg: "User Not Found" });
    // Check Role
    if (checkAdmin.role !== "admin") return res.json({ msg: "Access Denied" });
    // Create New Product
    value.image = req.file.path;
    const product = await Product.create(value);
    // Response

    res.status(201).json({
      msg: "Done Create Product",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

const getAllProductsController = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};
const searchProductController = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) return res.status(400).json({ msg: "Missing ID" });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ID format" });
    }

    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ msg: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  addProductController,
  getAllProductsController,
  searchProductController,
};

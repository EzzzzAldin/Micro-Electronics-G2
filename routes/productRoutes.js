const express = require("express");

const router = express.Router();

const {
  addProductController,
  getAllProductsController,
  searchProductController,
} = require("../controllers/productController");

const authMiddleware = require("../Middleware/authMiddleware");

const uploadImageProduct = require("../Middleware/uploadImage");

router.post(
  "/product",
  authMiddleware,
  uploadImageProduct,
  addProductController,
);
router.get("/product", getAllProductsController);
router.get("/product/search", searchProductController);

module.exports = router;

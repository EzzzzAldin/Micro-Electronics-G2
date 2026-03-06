const express = require("express");

const router = express.Router();

const {
  addProductController,
  getAllProductsController,
  searchProductController,
} = require("../controllers/productController");

router.post("/product", addProductController);
router.get("/product", getAllProductsController);
router.get("/product/search", searchProductController);

module.exports = router;

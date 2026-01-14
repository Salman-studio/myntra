const express = require("express");
const Product = require("../models/Product");
const Category = require("../models/Category");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { categoryId } = req.query;
    
    if (categoryId) {
      // Get products by category
      const category = await Category.findById(categoryId).populate("productId");
      if (!category) {
        return res.status(404).json({ 
          success: false,
          message: "Category not found" 
        });
      }
      return res.status(200).json({
        success: true,
        products: category.productId
      });
    }
    
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      success: false,
      message: "Something went wrong" 
    });
  }
});

router.get("/:id", async (req, res) => {
  const productid = req.params.id;
  try {
    const product = await Product.findById(productid);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      success: false,
      message: "Something went wrong" 
    });
  }
});
module.exports = router;

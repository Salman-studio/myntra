const express = require("express");
const Category = require("../models/Category");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().populate("productId");
    res.status(200).json({
      success: true,
      categories
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

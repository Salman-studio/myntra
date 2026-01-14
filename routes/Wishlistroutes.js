const express = require("express");
const Wishlist = require("../models/Wishlist");
const router = express.Router();
const authenticate = require("../middleware/auth");

router.post("/", authenticate, async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    // Verify user can only add to their own wishlist
    if (userId && userId !== req.userId) {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    const useId = req.userId; // Use authenticated user's ID
    if (!productId) {
      return res.status(400).json({ 
        success: false,
        message: "Product ID is required" 
      });
    }

    // Check if item already exists in wishlist
    const existingItem = await Wishlist.findOne({ userId: useId, productId });
    if (existingItem) {
      return res.status(400).json({ 
        success: false,
        message: "Item already in wishlist" 
      });
    }

    const wishlistItem = new Wishlist({ userId: useId, productId });
    const savedItem = await wishlistItem.save();
    await savedItem.populate("productId");
    
    res.status(200).json({
      success: true,
      message: "Item added to wishlist",
      item: savedItem
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      success: false,
      message: "Something went wrong" 
    });
  }
});

router.get("/:userid", authenticate, async (req, res) => {
  try {
    const userId = req.params.userid;
    
    // Verify user can only access their own wishlist
    if (userId !== req.userId) {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    const bag = await Wishlist.find({ userId }).populate("productId");
    res.status(200).json({
      success: true,
      wishlist: bag
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      success: false,
      message: "Something went wrong" 
    });
  }
});

router.delete("/:itemid", authenticate, async (req, res) => {
  try {
    const item = await Wishlist.findById(req.params.itemid);
    
    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: "Item not found" 
      });
    }

    // Verify user owns this wishlist item
    if (item.userId.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    await Wishlist.findByIdAndDelete(req.params.itemid);
    res.status(200).json({ 
      success: true,
      message: "Item removed from Wishlist" 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      success: false,
      message: "Error removing item from Wishlist" 
    });
  }
});
module.exports = router;

const express = require("express");
const Bag = require("../models/Bag");
const router = express.Router();
const authenticate = require("../middleware/auth");

router.post("/", authenticate, async (req, res) => {
  try {
    const { userId, productId, size, quantity } = req.body;
    
    // Verify user can only add to their own bag
    if (userId && userId !== req.userId) {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    const useId = req.userId; // Use authenticated user's ID
    if (!productId || !size) {
      return res.status(400).json({ 
        success: false,
        message: "Product ID and size are required" 
      });
    }

    // Check if item with same product and size already exists
    const existingItem = await Bag.findOne({ userId: useId, productId, size });
    
    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity || 1;
      await existingItem.save();
      await existingItem.populate("productId");
      return res.status(200).json({
        success: true,
        message: "Item quantity updated in bag",
        item: existingItem
      });
    }

    const bagItem = new Bag({ userId: useId, productId, size, quantity: quantity || 1 });
    const savedItem = await bagItem.save();
    await savedItem.populate("productId");
    
    res.status(200).json({
      success: true,
      message: "Item added to bag",
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

router.put("/:itemid", authenticate, async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await Bag.findById(req.params.itemid);
    
    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: "Item not found" 
      });
    }

    // Verify user owns this bag item
    if (item.userId.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    if (quantity <= 0) {
      await Bag.findByIdAndDelete(req.params.itemid);
      return res.status(200).json({
        success: true,
        message: "Item removed from bag"
      });
    }

    item.quantity = quantity;
    await item.save();
    
    res.status(200).json({
      success: true,
      message: "Item quantity updated",
      item
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      success: false,
      message: "Error updating item" 
    });
  }
});

router.get("/:userid", authenticate, async (req, res) => {
  try {
    const userId = req.params.userid;
    
    // Verify user can only access their own bag
    if (userId !== req.userId) {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    const bag = await Bag.find({ userId }).populate("productId");
    res.status(200).json({
      success: true,
      bag
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
    const item = await Bag.findById(req.params.itemid);
    
    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: "Item not found" 
      });
    }

    // Verify user owns this bag item
    if (item.userId.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    await Bag.findByIdAndDelete(req.params.itemid);
    res.status(200).json({ 
      success: true,
      message: "Item removed from bag" 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      success: false,
      message: "Error removing item from bag" 
    });
  }
});
module.exports = router;

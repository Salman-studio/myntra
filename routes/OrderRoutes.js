const express = require("express");
const Bag = require("../models/Bag");
const Order = require("../models/Order");
const router = express.Router();
const mongoose = require("mongoose");
const authenticate = require("../middleware/auth");

function genrateRandomTracking() {
  const carriers = ["Delhivery", "Bluedart", "Ecom Express", "XpressBees"];
  const statusOptions = [
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "In Transit",
  ];
  const locations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune"];
  const randomcarrier = carriers[Math.floor(Math.random() * carriers.length)];
  const randomstatusOptions =
    statusOptions[Math.floor(Math.random() * statusOptions.length)];
  const randomlocations =
    locations[Math.floor(Math.random() * locations.length)];

  return {
    number: "TRK" + Math.floor(Math.random() * 10000000),
    carrier: randomcarrier,
    estimatedDelivery: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    currentLocation: randomlocations,
    status: randomstatusOptions,
    timeline: [
      {
        status: "Order placed",
        location: "Warehouse",
        timestamp: new Date().toISOString(),
      },
      {
        status: randomstatusOptions,
        location: randomlocations,
        timestamp: new Date().toISOString(),
      },
    ],
  };
}
router.post("/create/:userId", authenticate, async (req, res) => {
  try {
    const userid = req.params.userId;
    
    // Verify user can only create orders for themselves
    if (userid !== req.userId) {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    if (!req.body.shippingAddress) {
      return res.status(400).json({ 
        success: false,
        message: "Shipping address is required" 
      });
    }

    const bag = await Bag.find({ userId: userid }).populate("productId");
    if (bag.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "No items in the bag" 
      });
    }

    const orderitems = bag.map((item) => ({
      productId: item.productId._id,
      size: item.size,
      price: item.productId.price,
      quantity: item.quantity,
    }));

    const total = orderitems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      userId: userid,
      date: new Date().toISOString(),
      status: "Processing",
      items: orderitems,
      total: total,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod || "Card",
      tracking: genrateRandomTracking(),
    });

    await newOrder.save();
    await Bag.deleteMany({ userId: userid });

    res.status(200).json({ 
      success: true,
      message: "Order placed successfully",
      order: newOrder
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      success: false,
      message: error.message || "Something went wrong" 
    });
  }
});
router.get("/user/:userid", authenticate, async (req, res) => {
  try {
    const userid = req.params.userid;
    
    // Verify user can only access their own orders
    if (userid !== req.userId) {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    const order = await Order.find({ userId: userid }).populate(
      "items.productId"
    );
    res.status(200).json({
      success: true,
      orders: order
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
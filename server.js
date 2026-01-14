const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

/* ================= ROUTES ================= */

const userRoutes = require("./routes/Userroutes");
const categoryRoutes = require("./routes/Categoryroutes");
const productRoutes = require("./routes/Productroutes");
const wishlistRoutes = require("./routes/Wishlistroutes");
const bagRoutes = require("./routes/Bagroutes");
const orderRoutes = require("./routes/OrderRoutes");

/* ================= HEALTH ================= */

app.get("/", (req, res) => {
  res.json({ message: "API is running", status: "OK" });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

/* ================= API ================= */

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/bag", bagRoutes);
app.use("/api/order", orderRoutes);

/* ================= DATABASE ================= */

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

/* ================= 404 ================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

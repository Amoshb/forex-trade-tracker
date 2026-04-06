const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/auth-middleware");
const {
  createTrade,
  getTrades,
  deleteTrade,
  updateTrade,
} = require("../Controller/trade-controller");

router.post("/create", authMiddleware, createTrade);
router.get("/all_trades", authMiddleware, getTrades);
router.delete("/delete/:id", authMiddleware, deleteTrade);
router.put("/update/:id", authMiddleware, updateTrade);

module.exports = router;

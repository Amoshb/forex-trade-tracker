const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/auth-middleware");
const {
  createTrade,
  getTrades,
  deleteTrade,
  updateTrade,
  getPaginatedTrade,
  getTradeFilterOptions,
} = require("../Controller/Trade/trade-crud");

const {
  totalWinandLoss,
  tradeStats,
} = require("../Controller/Trade/trade-analysis.js");

router.post("/create", authMiddleware, createTrade);
router.get("/all_trades", authMiddleware, getTrades);
router.delete("/delete/:id", authMiddleware, deleteTrade);
router.put("/update/:id", authMiddleware, updateTrade);

router.get("/all_trade_paginated", authMiddleware, getPaginatedTrade);
router.get("/filter-options", authMiddleware, getTradeFilterOptions);

router.get("/total_win_and_loss", authMiddleware, totalWinandLoss);
router.get("/trade_stats", authMiddleware, tradeStats);

module.exports = router;

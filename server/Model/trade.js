const mongoose = require("mongoose");

const TradeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },

    direction: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
    },

    volume: {
      type: Number,
      required: true,
    },

    openPrice: {
      type: Number,
      required: true,
    },

    closePrice: {
      type: Number,
      required: true,
    },

    stopLoss: {
      type: Number,
    },

    takeProfit: {
      type: Number,
    },

    profitLoss: {
      type: Number,
      required: true,
    },

    strategy: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Trade", TradeSchema);

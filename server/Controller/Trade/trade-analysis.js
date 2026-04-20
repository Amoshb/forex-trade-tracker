const Trade = require("../../Model/trade");
const mongoose = require("mongoose");

const totalWinandLoss = async (req, res) => {
  try {
    const userId = req.userInfo.userID;
    const wins = await Trade.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: 1,
          },
          win: {
            $sum: { $cond: [{ $gt: ["$profitLoss", 0] }, 1, 0] },
          },

          loss: {
            $sum: { $cond: [{ $lt: ["$profitLoss", 0] }, 1, 0] },
          },

          breakeven: {
            $sum: { $cond: [{ $eq: ["$profitLoss", 0] }, 1, 0] },
          },
        },
      },
    ]);
    const result = wins[0];

    res.status(200).json({
      success: true,
      userid: userId,
      data: result,
      profitPercentage: (result.win / result.total) * 100,
      lossPercentage: (result.loss / result.total) * 100,
      breakevenPercentage: (result.breakeven / result.total) * 100,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e.error,
    });
  }
};

const aggregateTrades = async (userId, groupId, keyFn) => {
  const data = await Trade.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: groupId,
        totalwins: {
          $sum: { $cond: [{ $gt: ["$profitLoss", 0] }, "$profitLoss", 0] },
        },
        totalloss: {
          $sum: { $cond: [{ $lt: ["$profitLoss", 0] }, "$profitLoss", 0] },
        },
        totalPnl: { $sum: "$profitLoss" },
        win: { $sum: { $cond: [{ $gt: ["$profitLoss", 0] }, 1, 0] } },
        loss: { $sum: { $cond: [{ $lt: ["$profitLoss", 0] }, 1, 0] } },
        breakeven: { $sum: { $cond: [{ $eq: ["$profitLoss", 0] }, 1, 0] } },
        maxwinings: { $max: "$profitLoss" },
        minwinings: { $min: "$profitLoss" },
      },
    },
  ]);

  const formatted = {};
  data.forEach((item) => {
    formatted[keyFn(item._id)] = {
      totalwins: item.totalwins,
      totalloss: item.totalloss,
      totalPnL: item.totalPnl,
      win_count: item.win,
      loss_count: item.loss,
      breakeven_count: item.breakeven,
      max_winning: item.maxwinings,
      min_winning: item.minwinings,
    };
  });

  return formatted;
};

const tradeStats = async (req, res) => {
  try {
    const userId = req.userInfo.userID;
    const { groupBy } = req.query; // e.g. ?groupBy=symbol,direction,strategy

    const fields = groupBy ? groupBy.split(",") : ["symbol"];

    // build the _id object dynamically
    const groupId = {};
    fields.forEach((field) => {
      groupId[field] = `$${field}`;
    });

    // build the key dynamically
    const keyFn = (id) => fields.map((f) => id[f]).join("_");

    const data = await aggregateTrades(userId, groupId, keyFn);
    res.status(200).json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

module.exports = {
  totalWinandLoss,
  tradeStats,
};

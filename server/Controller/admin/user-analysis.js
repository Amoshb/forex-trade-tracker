const User = require("../../Model/user");
const Trade = require("../../Model/trade");
const mongoose = require("mongoose");

const userStats = async (req, res) => {
  try {
    const total_users = await User.countDocuments();
    const total_trades = await Trade.countDocuments();

    res.status(200).json({
      success: true,
      total_users,
      total_trades,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getUsersWithTradeCount = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "trades",
          localField: "_id",
          foreignField: "userId",
          pipeline: [{ $count: "count" }],
          as: "tradeStats",
        },
      },
      {
        $project: {
          username: 1,
          role: 1,
          totalTrades: {
            $cond: {
              if: { $eq: ["$role", "admin"] },
              then: "$$REMOVE",
              else: {
                $ifNull: [{ $arrayElemAt: ["$tradeStats.count", 0] }, 0],
              },
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  userStats,
  getUsersWithTradeCount,
};

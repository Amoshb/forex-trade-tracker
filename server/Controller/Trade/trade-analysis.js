const Trade = require("../../model/trade");
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

    const result = wins[0] || {
      _id: null,
      total: 0,
      win: 0,
      loss: 0,
      breakeven: 0,
    };

    const profitPercentage =
      result.total > 0 ? (result.win / result.total) * 100 : 0;

    const lossPercentage =
      result.total > 0 ? (result.loss / result.total) * 100 : 0;

    const breakevenPercentage =
      result.total > 0 ? (result.breakeven / result.total) * 100 : 0;

    res.status(200).json({
      success: true,
      userid: userId,
      data: result,
      profitPercentage,
      lossPercentage,
      breakevenPercentage,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};

const aggregateTrades = async (userId, fields) => {
  let groupId;

  if (fields.length === 1) {
    groupId = {
      [fields[0]]: `$${fields[0]}`,
    };
  } else {
    groupId = {};
    fields.forEach((field) => {
      groupId[field] = `$${field}`;
    });
  }

  const data = await Trade.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: groupId,
        totalwins: {
          $sum: { $cond: [{ $gt: ["$profitLoss", 0] }, "$profitLoss", 0] },
        },
        totalloss: {
          $sum: { $cond: [{ $lt: ["$profitLoss", 0] }, "$profitLoss", 0] },
        },
        totalPnL: { $sum: "$profitLoss" },
        win_count: {
          $sum: { $cond: [{ $gt: ["$profitLoss", 0] }, 1, 0] },
        },
        loss_count: {
          $sum: { $cond: [{ $lt: ["$profitLoss", 0] }, 1, 0] },
        },
        breakeven_count: {
          $sum: { $cond: [{ $eq: ["$profitLoss", 0] }, 1, 0] },
        },
        max_winning: { $max: "$profitLoss" },
        min_winning: { $min: "$profitLoss" },
        trade_count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        ...fields.reduce((acc, field) => {
          acc[field] = `$_id.${field}`;
          return acc;
        }, {}),
        totalwins: 1,
        totalloss: 1,
        totalPnL: 1,
        win_count: 1,
        loss_count: 1,
        breakeven_count: 1,
        max_winning: 1,
        min_winning: 1,
        trade_count: 1,
      },
    },
  ]);

  return data;
};

const tradeStats = async (req, res) => {
  try {
    const userId = req.userInfo.userID;
    const { groupBy } = req.query;

    const allowedFields = ["symbol", "direction", "strategy"];
    const fields = groupBy
      ? groupBy.split(",").map((field) => field.trim())
      : ["symbol"];

    const invalidFields = fields.filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid groupBy field(s): ${invalidFields.join(", ")}`,
      });
    }

    const data = await aggregateTrades(userId, fields);

    res.status(200).json({
      success: true,
      groupBy: fields,
      count: data.length,
      data,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};
module.exports = {
  totalWinandLoss,
  tradeStats,
};

const Trade = require("../Model/trade");

const createTrade = async (req, res) => {
  try {
    const {
      symbol,
      direction,
      volume,
      openPrice,
      closePrice,
      stopLoss,
      takeProfit,
      profitLoss,
      strategy,
      notes,
    } = req.body;
    const userId = req.userInfo.userID;

    const newTrade = new Trade({
      userId,
      symbol,
      direction,
      volume,
      openPrice,
      closePrice,
      stopLoss,
      takeProfit,
      profitLoss,
      strategy,
      notes,
    });

    await newTrade.save();
    res.status(201).json({
      success: true,
      message: "Trade created successfully",
      trade: newTrade,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getTrades = async (req, res) => {
  try {
    const userId = req.userInfo.userID;
    const trades = await Trade.find({ userId });
    res.status(200).json({
      success: true,
      trades,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteTrade = async (req, res) => {
  try {
    const userId = req.userInfo.userID;
    const tradeId = req.params.id;

    const trade = await Trade.findOneAndDelete({ _id: tradeId, userId });
    if (!trade) {
      return res.status(404).json({
        success: false,
        message: "Trade not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Trade deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateTrade = async (req, res) => {
  try {
    const userId = req.userInfo.userID;
    const tradeId = req.params.id;
    const { _userId, ...updateData } = req.body;

    const trade = await Trade.findOneAndUpdate(
      { _id: tradeId, userId },
      updateData,
      { new: true },
    );

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: "Trade not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Trade updated successfully",
      trade,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getPaginatedTrade = async (req, res) => {
  try {
    const userId = req.userInfo.userID;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);

    const skip = (page - 1) * limit;

    const totalTrades = await Trade.countDocuments({ userId });

    const trades = await Trade.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalTrades / limit);

    res.status(200).json({
      success: true,
      trades,
      pagination: {
        currentPage: page,
        totalPages,
        totalTrades,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: e.message,
    });
  }
};

module.exports = {
  createTrade,
  getTrades,
  deleteTrade,
  updateTrade,
  getPaginatedTrade,
};

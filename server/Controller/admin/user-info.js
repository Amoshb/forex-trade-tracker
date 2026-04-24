const User = require("../../Model/user");
const mongoose = require("mongoose");
const Trade = require("../../Model/trade");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getOneUser = async (req, res) => {
  try {
    const getUserID = req.params.id;
    const userDetailsbyID = await User.findById(getUserID);
    const userTradeData = await Trade.find({
      userId: new mongoose.Types.ObjectId(getUserID),
    });
    if (!userDetailsbyID) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist",
      });
    }
    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      userdata: userDetailsbyID,
      tradedata: userTradeData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteUserAndTrade = async (req, res) => {
  try {
    const getUserID = req.params.id;
    const userTrades = await Trade.deleteMany({
      userId: new mongoose.Types.ObjectId(getUserID),
    });
    const deletedUser = await User.findByIdAndDelete(getUserID);

    if (!deletedUser){
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    res.status(200).json({
        success: true,
        deleted_trade: userTrades.deletedCount,
        message: "User is deleted"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, select: "username role" },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getOneUser,
  deleteUserAndTrade,
  updateUserRole
};

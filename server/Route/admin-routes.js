const express = require("express");
const authMiddleware = require("../Middleware/auth-middleware");
const { isAdminUser } = require("../Middleware/admin-middleware");
const {
  getUsers,
  getOneUser,
  deleteUserAndTrade,
} = require("../Controller/admin/user-info");
const {
  userStats,
  getUsersWithTradeCount,
} = require("../Controller/admin/user-analysis");

const router = express.Router();

router.get("/users", authMiddleware, isAdminUser, getUsers);
router.get("/users/:id", authMiddleware, isAdminUser, getOneUser);
router.delete(
  "/deleteuser/:id",
  authMiddleware,
  isAdminUser,
  deleteUserAndTrade,
);

router.get("/users_stats", authMiddleware, isAdminUser, userStats);
router.get(
  "/users_trade_stats",
  authMiddleware,
  isAdminUser,
  getUsersWithTradeCount,
);

module.exports = router;

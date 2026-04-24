const express = require("express");
const authMiddleware = require("../Middleware/auth-middleware");
const { isAdminUser } = require("../Middleware/admin-middleware");
const {
  getUsers,
  getOneUser,
  deleteUserAndTrade,
  updateUserRole
} = require("../Controller/admin/user-info");
const {
  userStats,
  getUsersWithTradeCount,
} = require("../Controller/admin/user-analysis");

const router = express.Router();

router.get("/users", authMiddleware, isAdminUser, getUsers);
router.get("/users/:id", authMiddleware, isAdminUser, getOneUser);


router.delete(
  "/delete-user/:id",
  authMiddleware,
  isAdminUser,
  deleteUserAndTrade,
);

router.get("/user-stats", authMiddleware, isAdminUser, userStats);
router.get(
  "/users-with-trade-count",
  authMiddleware,
  isAdminUser,
  getUsersWithTradeCount,
);


router.put("/update-user-role/:id", authMiddleware, isAdminUser, updateUserRole);
module.exports = router;

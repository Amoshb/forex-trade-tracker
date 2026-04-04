const express = require("express");
const authMiddleware = require("../Middleware/auth-middleware");
const { isAdminUser } = require("../Middleware/admin-middleware");

const router = express.Router();

router.get("/admin-only", authMiddleware, isAdminUser, (req, res) => {
  res.json({
    success: true,
    message: `Welcome, admin user: ${req.userInfo.username}! You have access to this route.`,
  });
});

module.exports = router;

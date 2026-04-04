const isAdminUser = (req, res, next) => {
  const { role } = req.userInfo;

  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};

module.exports = {
  isAdminUser,
};

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userInfo = decodedTokenInfo;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token expired or Invalid.",
    });
  }
};

module.exports = authMiddleware;

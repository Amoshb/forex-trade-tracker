const bycrypt = require("bcryptjs");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { userName, userPass } = req.body;

    const existingUser = await User.findOne({ username: userName });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists with this username. Please choose another.",
      });
    }

    if (userName && userPass) {
      const salt = await bycrypt.genSalt(10);
      const hashedPassword = await bycrypt.hash(userPass, salt);

      const newUser = new User({
        username: userName,
        password: hashedPassword,
        role: "user",
      });

      await newUser.save();

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: newUser,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to register user",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    const isMatch = await bycrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = jwt.sign(
      {
        userID: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = { registerUser, loginUser };

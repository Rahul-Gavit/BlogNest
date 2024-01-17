const User = require("../model/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({
      userCount: users.length,
      success: true,
      message: "All users data",
      users,
    });
  } catch (error) {
    console.error("Error in Get All Users:", error);
    res.status(500).json({
      message: "Error in Get All Users",
      success: false,
      error: error.message,
    });
  }
};

// Register user
exports.registerController = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    // Check if user already exists
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    // Save new User
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name: fullname,
      username,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ message: "Successfully signed up!", token });
  } catch (error) {
    console.error("Error in signup callback:", error);
    res.status(500).json({
      message: "Error in signup callback",
      success: false,
      error: error.message,
    });
  }
};

// Login user
exports.loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email is not registered",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const express = require("express");
const User = require("../models/Users");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, phone, password, userType } = req.body;

  try {
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      userType,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if account is active
    if (user.isActive === false) {
      return res.status(403).json({
        message:
          "Your account has been deactivated due to suspicious activity. Please contact support for assistance.",
      });
    }

    res.status(200).json({
      message: "Login successful",
      userType: user.userType,
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;

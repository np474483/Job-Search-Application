const express = require("express")
const User = require("../models/Users")

const router = express.Router()

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, phone, password, userType } = req.body

  try {
    // Check if user with this email already exists
    const existingUserByEmail = await User.findOne({ email })
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email already in use" })
    }

    // Check if user with this phone already exists
    const existingUserByPhone = await User.findOne({ phone })
    if (existingUserByPhone) {
      return res.status(400).json({ message: "Phone number already in use" })
    }

    const newUser = new User({ firstName, lastName, email, phone, password, userType })
    await newUser.save()
    res.status(201).json({ message: "User created successfully", user: newUser })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(400).json({ message: "Error creating user", error: error.message })
  }
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    // Check if account is active
    if (user.isActive === false) {
      return res.status(403).json({
        message: "Your account has been deactivated due to suspicious activity. Please contact support for assistance.",
      })
    }

    res.status(200).json({
      message: "Login successful",
      userType: user.userType,
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
})

module.exports = router

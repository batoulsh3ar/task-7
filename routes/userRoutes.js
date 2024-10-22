const express = require("express");
const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const user = new User(req.body);
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email,age: user.age },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email ,age: user.age},
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users (GET)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    const users2 = users.map((user) => {
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,

      };
    });
    res.status(200).json(users2);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a user by ID (GET)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // user.password="************";
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a user by ID (PUT)
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user by ID (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

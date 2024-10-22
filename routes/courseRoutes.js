const express = require("express");
const Course = require("../models/Course");
const User = require("../models/User");
const Video = require("../models/Video");
const authMiddleware = require("../middleware/auth");
const accessToCourse = require("../middleware/accessToCourse");
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find().populate("user_id").populate("videos");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("user_id")
      .populate("videos");
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/", authMiddleware, async (req, res) => {
  try {
    const course = new Course({
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      user_id: req.user._id,
    });

    await course.save();

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware, accessToCourse, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, accessToCourse, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const videos = await Video.deleteMany({
      course_id: req.params.id,
    }).populate("comments");
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

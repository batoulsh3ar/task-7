const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Course = require("../models/Course");
const Video = require("../models/Video");

const accessToVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "video not found" });
    }
    // this course?.user_id will return object, so we want to convert it to string
    if (video?.user_id?.toString() == req.user._id.toString()) {
      next(); // Move to the next middleware
    } else {
      // autorization
      res.status(403).json({ message: "You can not edit this post" });
    }
  } catch (error) {
    // authentication
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = accessToVideo;

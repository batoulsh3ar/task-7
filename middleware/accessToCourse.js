const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Course = require("../models/Course");

const accessToCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    

    if (!course) {
      return res.status(404).json({ message: "course not found from acc" });
    }
    // this course?.user_id will return object, so we want to convert it to string
    if (course?.user_id?.toString() == req.user._id.toString()) {
      next(); // Move to the next middleware
    } else {
      // autorization
      res.status(403).json({ message: "You can not edit this course" });
    }
  } catch (error) {
    // authentication
    res.status(401).json({ message: "Invalid " });
  }
};

module.exports = accessToCourse;

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Comment = require("../models/Comment");

const accessToComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    

    if (!comment) {
      return res.status(404).json({ message: "comment not found from acc" });
    }
    // this course?.user_id will return object, so we want to convert it to string
    if (comment?.user_id?.toString() == req.user._id.toString()) {
      next(); // Move to the next middleware
    } else {
      // autorization
      res.status(403).json({ message: "You can not edit this comment" });
    }
  } catch (error) {
    // authentication
    res.status(401).json({ message: "Invalid " });
  }
};

module.exports = accessToComment;

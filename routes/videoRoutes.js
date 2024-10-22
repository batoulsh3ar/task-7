const express = require("express");
const Video = require("../models/Video");
const Course = require("../models/Course");
const Comment = require("../models/Comment");
const authMiddleware = require("../middleware/auth");
const accessToVideo = require("../middleware/accessToVideo.js");
const accessToCourse = require("../middleware/accessToCourse");
const accessToComment = require("../middleware/accessToComment");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const videos = await Video.find().populate("comments");
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("comments");
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/course/:id", authMiddleware, async (req, res) => {
  try {
    const videos = await Video.find({course_id: req.params.id}).populate("comments");
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/:id", authMiddleware, accessToCourse, async (req, res) => {
  try {
    const course_id = req.params.id;
    const course = await Course.findById(course_id);
    const video = new Video({
      title: req.body.title,
      description: req.body.description,
      user_id: req.user._id,
      course_id: course_id,
    });
    await video.save();
    course.videos.push(video);
    await course.save();

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware, accessToVideo, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!video) {
      return res.status(404).json({ message: "video not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, accessToVideo, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
  
    if (!video) {
      return res.status(404).json({ message: "video not found" });
    }
    // const course_id=video.course_id;
    // const course = await Course.findByIdAndUpdate(video.course_id)
    res.status(200).json({ message: "video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//delete by course id
router.delete("/course/:id", authMiddleware, async (req, res) => {
  try {
    const videos = await Video.deleteMany({ course_id: req.params.id }).populate(
      "comments"
    );
   
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//comment-Router add,delete,update,getAllByVideoId
router.get("/comments/:id", authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find({ video_id: req.params.id });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/comments/:id", authMiddleware, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "video not found" });
    }
    const comment = new Comment({
      content: req.body.content,
      video_id: req.params.id,
      user_id: req.user._id,
    });
    await comment.save();
    video.comments.push(comment);
    await video.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put(
  "/comments/:id",
  authMiddleware,
  accessToComment,
  async (req, res) => {
    try {
      const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      // const video_id = comment.video_id;
      // const video = await Video.findById(video_id);
      // console.log(video.comments);
      if (!comment) {
        return res.status(404).json({ message: "comment not found" });
      }

      res.status(200).json(comment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.delete(
  "/comments/:id",
  authMiddleware,
  accessToComment,
  async (req, res) => {
    try {
      const comment = await Comment.findByIdAndDelete(req.params.id);
      if (!comment) {
        return res.status(404).json({ message: "comment not found" });
      }
      res.status(200).json({ message: "comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;

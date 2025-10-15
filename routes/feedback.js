const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback");
const { isValidUser } = require("../middleware/auth");
router.get("/", isValidUser, async (req, res) => {
  try {
    const { sort } = req.query;
    let feedbacks;
    if (sort === "mostLiked") {
      feedbacks = await Feedback.find().sort({ likes: -1, createdAt: -1 });
    } else {
      feedbacks = await Feedback.find().sort({ createdAt: -1 });
    }
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", isValidUser, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback)
      return res.status(404).json({ message: "Feedback not found" });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/", isValidUser, async (req, res) => {
  try {
    const { user, email, message } = req.body;
    const newFeedback = new Feedback({
      user,
      email,
      message,
      userId: req.user._id,
    });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", isValidUser, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback)
      return res.status(404).json({ message: "Feedback not found" });

    if (
      req.user.role !== "admin" &&
      feedback.userId.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not allowed to edit this feedback" });
    }

    feedback.message = req.body.message || feedback.message;
    await feedback.save();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", isValidUser, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback)
      return res.status(404).json({ message: "Feedback not found" });

    if (
      req.user.role !== "admin" &&
      feedback.userId.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this feedback" });
    }

    await feedback.deleteOne();
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

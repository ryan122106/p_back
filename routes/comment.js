const express = require("express");
const router = express.Router();
const { isValidUser } = require("../middleware/auth");
const Comment = require("../models/comment");
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/comment");


router.get("/:noteId", isValidUser, async (req, res) => {
  try {
    const comments = await getComments(req.params.noteId);
    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Server error fetching comments" });
  }
});


router.post("/:noteId", isValidUser, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content is required" });

    const comment = await createComment(req.params.noteId, req.user._id, content);
    res.status(201).json(comment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: "Server error creating comment" });
  }
});


router.put("/:id", isValidUser, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (
      comment.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to edit this comment" });
    }

    const updated = await updateComment(req.params.id, req.body.content);
    res.json(updated);
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ message: "Server error updating comment" });
  }
});


router.delete("/:id", isValidUser, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (
      comment.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await deleteComment(req.params.id);
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Server error deleting comment" });
  }
});

module.exports = router;

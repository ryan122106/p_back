const express = require("express");
const router = express.Router();
const Note = require("../models/note");
const { isValidUser } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const { search, user, sort } = req.query; 
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (user) {
      query.user = user;
    }

    const sortOption =
      sort === "mostLiked" ? { likesCount: -1 } : { createdAt: -1 };

    const notes = await Note.find(query)
      .populate("user", "name role")
      .sort(sortOption);

    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate(
      "user",
      "name role"
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/", isValidUser, async (req, res) => {
  try {
    const newNote = new Note({
      title: req.body.title,
      content: req.body.content,
      user: req.user._id,
      media: req.body.media || [],
    });
    await newNote.save();
    await newNote.populate("user", "name role");
    res.status(201).json(newNote);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", isValidUser, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (
      req.user.role !== "admin" &&
      note.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to edit this note" });
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    note.media = req.body.media || note.media;

    await note.save();
    await note.populate("user", "name role");
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", isValidUser, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (
      req.user.role !== "admin" &&
      note.user.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this note" });
    }

    await note.deleteOne();
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

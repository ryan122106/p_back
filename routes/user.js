const express = require("express");
const router = express.Router();

const { login, signup } = require("../controllers/user");
const User = require("../models/user");
const Note = require("../models/note");
const Like = require("../models/like");


const { isValidUser, isAdmin } = require("../middleware/auth");


router.get("/", isValidUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { search } = req.query; 
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(filter).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/role", isValidUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await login(email, password);
    res.status(200).send(user);
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(400).send({ message: error.message });
  }
});

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await signup(name, email, password);
    res.status(200).send(user);
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(400).send({ message: error.message || "Something went wrong" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).send(user);
  } catch (error) {
    console.error("Get user error:", error.message);
    res.status(500).send({ message: "Server error" });
  }
});

router.get("/:id/notes", async (req, res) => {
  try {
    const notes = await Note.find({ user: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).send(notes);
  } catch (error) {
    console.error("Error fetching user's notes:", error.message);
    res.status(500).send({ message: "Error fetching user's notes" });
  }
});

router.get("/:id/likes", async (req, res) => {
  try {
    const likes = await Like.find({ userId: req.params.id, itemType: "note" });
    const noteIds = likes.map((like) => like.itemId);
    const notes = await Note.find({ _id: { $in: noteIds } })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).send(notes);
  } catch (error) {
    console.error("Error fetching liked notes:", error.message);
    res.status(500).send({ message: "Error fetching liked notes" });
  }
});


// ✅ Block or Unblock a user (admin only)
router.put("/:id/block", isValidUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const { isBlocked } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked },
      { new: true }
    ).select("-password");
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({
      message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
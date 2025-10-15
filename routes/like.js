const express = require("express");
const router = express.Router();
const { isValidUser } = require("../middleware/auth");
const Like = require("../models/like");

router.post("/:itemId/toggle", isValidUser, async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const userId = req.user._id;
    const { itemType = "note" } = req.body;

    const existing = await Like.findOne({ userId, itemId, itemType });

    if (existing) {
      await existing.deleteOne();
      return res.json({ message: "Unliked" });
    } else {
      const newLike = new Like({ userId, itemId, itemType });
      await newLike.save();
      return res.json({ message: "Liked" });
    }
  } catch (err) {
    console.error("Toggle like error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/count", async (req, res) => {
  try {
    const { itemId, itemType } = req.query;

    if (!itemId || !itemType) {
      return res.status(400).json({ message: "Missing itemId or itemType" });
    }

    const count = await Like.countDocuments({ itemId, itemType });
    res.json({ count });
  } catch (err) {
    console.error("Count likes error:", err.message);

    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

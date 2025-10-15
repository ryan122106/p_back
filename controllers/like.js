const Like = require("../models/like");

const toggleLike = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    const userId = req.user._id;

    if (!["note", "comment", "feedback"].includes(itemType))
      return res.status(400).json({ message: "Invalid type" });

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
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getLikesCount = async (req, res) => {
  try {
    const { itemId, itemType } = req.query;
    const count = await Like.countDocuments({ itemId, itemType });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { toggleLike, getLikesCount };

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// ✅ Stable storage path for all environments (local or PM2)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage });

router.post("/", upload.array("media", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).send({ message: "No files uploaded" });

    // ✅ Convert file paths to URLs
    const urls = req.files.map(file => `/uploads/${path.basename(file.path)}`);
    res.status(200).send({ urls });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Unable to upload files" });
  }
});

module.exports = router;

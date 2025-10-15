const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the upload folder always exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Setup Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

// Upload endpoint
router.post("/", upload.array("media", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).send({ message: "No files uploaded" });

    // Return URLs to access uploaded files
    const urls = req.files.map(
      (file) => `/uploads/${path.basename(file.path)}`
    );
    res.status(200).send({ urls });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).send({ message: "Unable to upload files" });
  }
});

module.exports = router;

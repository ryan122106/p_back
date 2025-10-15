const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage });

router.post("/", upload.array("media", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).send({ message: "No files uploaded" });

    const src = file.startsWith("http")
      ? file
      : `${window.location.origin}/${file
          .replace(/^\/+/, "")
          .replace(/\\/g, "/")}`;

    res.status(200).send({ urls });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Unable to upload files" });
  }
});

module.exports = router;

const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "game_videos", // Cloudinary folder name
    format: async () => "mp4", // Force MP4 format
    public_id: (req, file) => `video_${Date.now()}`, // Unique name
  },
});

const upload = multer({ storage: storage });

// API to Upload Video
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    res.json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;

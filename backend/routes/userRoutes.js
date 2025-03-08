const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createUser, uploadVideo } = require("../controllers/userController");
const {uploadPhoto,uploadVideos } =require("../middleware/upload");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/") || file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video and image files are allowed"), false);
    }
  },
});

router.post("/users", uploadPhoto.single("photo"), createUser);
router.post("/upload/:userId", uploadVideos.single("video"), uploadVideo);

module.exports = router;
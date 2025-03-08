const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const photoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gesture-game",
    resource_type: "image",
    allowed_formats: ["png", "jpg", "jpeg"],
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gesture-game",
    resource_type: "video",
    allowed_formats: ["webm", "mp4"],
  },
});

const uploadPhoto = multer({ storage: photoStorage });
const uploadVideos = multer({ storage: videoStorage });

module.exports = { uploadPhoto, uploadVideos };
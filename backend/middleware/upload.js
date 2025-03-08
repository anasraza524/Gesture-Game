const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gesture-game",
    resource_type: "video",
  },
});

const upload = multer({ storage });
module.exports = upload;

const express = require("express");
const upload = require("../middleware/upload");
const { createUser, uploadVideo } = require("../controllers/userController");

const router = express.Router();

router.post("/user", createUser);
router.post("/upload/:userId", upload.single("video"), uploadVideo);

module.exports = router;

const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises; // For file cleanup

exports.createUser = async (req, res) => {
  try {
    const { name } = req.body;
console.log("name,file",name)
    let photo = "default.png";
    if (req.file) {
      console.log("Uploading photo to Cloudinary:", req.file.path);
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
        folder: "user_photos",
      });
      photo = result.secure_url;
      // Clean up local file
      // await fs.unlink(req.file.path).catch((err) =>
      //   console.error("Failed to delete local photo:", err)
      // );
    }

    // Check if user already exists by name
    let user = await User.findOne({ name });
    if (!user) {
      user = new User({
        name,
        photo,
        videos: [],
      });
      await user.save();
    }
console.log("user",user)
    res.status(201).json(user);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
};

exports.uploadVideo = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("User ID:", userId);

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found, please create an account first." });
    }

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    // Upload video to Cloudinary
    console.log("Uploading video to Cloudinary:", req.file.path);
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "gesture_videos",
    });
    const videoURL = result.secure_url;
    console.log("Video Uploaded to Cloudinary:", videoURL);

    // Save video URL to user
    user.videos.push(videoURL);
    await user.save();

    // Clean up local file
    // await fs.unlink(req.file.path).catch((err) =>
    //   console.error("Failed to delete local video:", err)
    // );

    res.status(200).json({ message: "Video uploaded successfully!", videoURL });
  } catch (err) {
    console.error("Error uploading video:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};
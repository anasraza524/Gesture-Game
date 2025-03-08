const User = require("../models/User");

exports.createUser = async (req, res) => {
  try {
    const { name, photo } = req.body;
    
    // Check if user already exists by name
    let user = await User.findOne({ name });

    if (!user) {
      user = new User({ name, photo, videos: [] });
      await user.save();
    }

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
};

exports.uploadVideo = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    // let user = await User.findById(userId);

    // if (!user) {
    //   return res.status(404).json({ message: "User not found, please create an account first." });

    // }

    // Upload video and update user
    const videoURL = req.file.path;
    console.log("Video Uploaded:", videoURL);

    user.videos.push(videoURL);
    await user.save();

    res.json({ message: "Video uploaded successfully!", videoURL });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

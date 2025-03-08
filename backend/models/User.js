const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  photo: String,
  videos: [String],
});

module.exports = mongoose.model("User", UserSchema);

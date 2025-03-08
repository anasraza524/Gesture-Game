import axios from "axios";

export const createUser = async (name, photo) => {
  try {
    const response = await axios.post("http://localhost:5000/api/user", {
      name,
      photo,
    });
    return response.data; // Returns the created user object
  } catch (error) {
    console.error("Error creating user:", error.response?.data || error.message);
    throw error;
  }
};

export const uploadVideo = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append("video", file);

    const response = await axios.post(
      `http://localhost:5000/api/upload/${userId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data.videoURL;
  } catch (error) {
    console.error("Video upload failed:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Usage Example:
export const handleUpload = async (name, photo, file) => {
  try {
    // 1️⃣ Create user if not exists
    const user = await createUser(name, photo);

    // 2️⃣ Upload video for this user
    const videoURL = await uploadVideo(user._id, file);

    console.log("Video uploaded successfully:", videoURL);
    return videoURL;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

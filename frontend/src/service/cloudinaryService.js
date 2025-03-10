import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
export const createUser = async (name, photo) => {
  try {
    console.log("name, photo",name, photo)
    const response = await axios.post(`${BASE_URL}/api/users`, {
      name,
      photo,
    });
    console.log("response",response)
    return response.data; // Returns the created user object
  } catch (error) {
    console.error("Error creating user:", error.response?.data || error.message);
    throw error;
  }
};

export const uploadVideo = async (userId, file) => {
  try {
    console.log("userId, file",userId, file)
    const formData = new FormData();
    formData.append("video", file);

    const response = await axios.post(`${BASE_URL}/api/upload/${userId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data.videoURL;
  } catch (error) {
    console.error("Video upload failed:", error.response?.data ,error.message);
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

import React, { useEffect, useState } from "react";
import Camera from "./components/Camera";
import GestureGame from "./components/GestureGame";
import axios from "axios";

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchOrCreateUser = async () => {
      let storedUserId = localStorage.getItem("userId");

      if (!storedUserId) {
        try {
          const response = await axios.post("http://localhost:5000/api/user", {
            name: "Guest User",
            photo: "default.png",
          });

          storedUserId = response.data._id;
          localStorage.setItem("userId", storedUserId);
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }

      setUserId(storedUserId);
    };

    fetchOrCreateUser();
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Gesture-Based Game</h1>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {userId ? <Camera userId={userId} /> : <p>Loading user...</p>}
        <GestureGame />
      </div>
    </>
  );
}

export default App;

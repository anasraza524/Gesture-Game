// App.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CameraSetup from "./components/CameraSetup";
import GestureGame from "./components/GestureGame";
import "./App.css";

function App() {
  const [userId, setUserId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showCameraSetup, setShowCameraSetup] = useState(false);
console.log("first",userId)
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId){ setUserId(storedUserId);setGameStarted(true)}
  }, []);

  const handleStartGame = () => {
    setGameStarted()
    setShowCameraSetup(true);
  };

  return (
    <div className="app-container">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="title"
      >
        Gesture Copycat Challenge
      </motion.h1>

      {!gameStarted ? (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={handleStartGame}
          className="start-button"
        >
          Get Started
        </motion.button>
      ) : (
        <GestureGame userId={userId} />
      )}

      {showCameraSetup && !userId && (
        <CameraSetup setUserId={setUserId} setGameStarted={setGameStarted} />
      )}
    </div>
  );
}

export default App;
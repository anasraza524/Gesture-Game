import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";
import { uploadVideo } from "../service/cloudinaryService";

const tasks = [
  "Show an angry face",
  "Make a happy gesture",
  "Give a thumbs up",
  "Wave hello",
];

const GestureGame = ({ userId }) => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [currentTask, setCurrentTask] = useState(0);
  const [recording, setRecording] = useState(false);
  const [videoChunks, setVideoChunks] = useState([]);
  const [videoURL, setVideoURL] = useState("");
  const [gesture, setGesture] = useState("");
  const [isTfReady, setIsTfReady] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const setup = async () => {
      try {
        await tf.setBackend("webgl");
        await tf.ready();
        const net = await handpose.load();
        setIsTfReady(true);
        startRecording();
        intervalRef.current = setInterval(() => detectGesture(net), 1000);
      } catch (error) {
        console.error("Error initializing TensorFlow.js or Handpose:", error);
      }
    };

    setup();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const detectGesture = async (net) => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4 &&
      isTfReady
    ) {
      try {
        const predictions = await net.estimateHands(webcamRef.current.video);
        if (predictions.length > 0) {
          const thumb = predictions[0].landmarks[4];
          const index = predictions[0].landmarks[8];
          setGesture(thumb[1] < index[1] ? "Thumbs Up" : "Unknown");
        } else {
          setGesture("No hands detected");
        }
      } catch (error) {
        console.error("Error detecting gesture:", error);
      }
    }
  };

  const startRecording = () => {
    if (webcamRef.current && webcamRef.current.stream) {
      setVideoChunks([]);
      setRecording(true);
      const stream = webcamRef.current.stream;
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "video/webm" });
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setVideoChunks((prev) => [...prev, e.data]);
        }
      };
      mediaRecorderRef.current.onstart = () => console.log("Recording started");
      mediaRecorderRef.current.onstop = () => console.log("Recording stopped");
      mediaRecorderRef.current.start(1000); // Capture data every 1000ms
    } else {
      console.error("Webcam stream not available");
    }
  };

  const finishTask = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setRecording(false);

      // Wait briefly for ondataavailable to fire
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (videoChunks.length === 0) {
        console.error("No video data captured");
        return;
      }

      const videoBlob = new Blob(videoChunks, { type: "video/webm" });
      console.log("Video Blob Size:", videoBlob.size);
      if (videoBlob.size === 0) {
        console.error("Captured video is empty");
        return;
      }

      const videoFile = new File([videoBlob], "recorded-video.webm", {
        type: "video/webm",
      });
      try {
        const uploadedURL = await uploadVideo(userId, videoFile);
        setVideoURL(uploadedURL);
        if (currentTask < tasks.length - 1) {
          setCurrentTask((prev) => prev + 1);
          startRecording();
        }
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  const shareVideo = () => {
    if (navigator.share && videoURL) {
      navigator.share({
        title: "My Gesture Game Video",
        url: videoURL,
      });
    }
  };

  return (
    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="game-container">
      <Webcam ref={webcamRef} />
      <h2>{tasks[currentTask]}</h2>
      <p>Current Gesture: {gesture}</p>
      {recording && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={finishTask}
          className="next-button"
        >
          Next Task
        </motion.button>
      )}
      {videoURL && (
        <div className="video-result">
          <video src={videoURL} controls />
          <div className="video-actions">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => (window.location.href = videoURL)}
              className="action-button"
            >
              Download
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={shareVideo}
              className="action-button"
            >
              Share
            </motion.button>
          </div>
        </div>
      )}
      {!isTfReady && <p>Loading TensorFlow.js and Handpose model...</p>}
    </motion.div>
  );
};

export default GestureGame;
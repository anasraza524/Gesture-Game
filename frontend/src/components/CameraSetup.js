import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { createUser } from "../service/cloudinaryService";
import * as faceapi from "face-api.js";

const CameraSetup = ({ setUserId, setGameStarted }) => {
  const webcamRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [capturingPhoto, setCapturingPhoto] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      return webcamRef.current.getScreenshot();
    }
    return null;
  }, []);

  const uploadPhotoAndCreateUser = useCallback(async () => {
    try {
      setCapturingPhoto(true);
      const photoBase64 = capturePhoto();
      if (!photoBase64) throw new Error("Failed to capture photo");

      const byteString = atob(photoBase64.split(",")[1]);
      const mimeString = photoBase64.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const photoBlob = new Blob([ab], { type: mimeString });
      const photoFile = new File([photoBlob], `user_${Date.now()}.png`, {
        type: "image/png",
      });

      const response = await createUser("Guest User", photoFile);
      console.log("response",response)
      localStorage.setItem("userId", response._id);
      setUserId(response._id);
      setFaceDetected(true);
      setGameStarted(true);
    } catch (error) {
      console.error("Error creating user with photo:", error);
      setError("Failed to create user. Please try again.");
    } finally {
      setCapturingPhoto(false);
    }
  }, [setUserId, setGameStarted, capturePhoto]);

  const loadModelsAndDetect = useCallback(async () => {
    try {
      if (!modelsLoaded) {
        console.log("Loading face-api.js models...");
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models").catch((err) => {
            throw new Error(`Failed to load tinyFaceDetector: ${err.message}`);
          }),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models").catch((err) => {
            throw new Error(`Failed to load faceLandmark68Net: ${err.message}`);
          }),
        ]);
        console.log("Models loaded successfully!");
        setModelsLoaded(true);
      }

      if (webcamRef.current && webcamRef.current.video.readyState === 4) {
        const detection = await faceapi.detectSingleFace(
          webcamRef.current.video,
          new faceapi.TinyFaceDetectorOptions()
        );

        if (detection && !faceDetected && !capturingPhoto) {
          console.log("Face detected!");
          await uploadPhotoAndCreateUser();
        }
      }
    } catch (error) {
      console.error("Error in loadModelsAndDetect:", error);
      setError(`Model loading or face detection failed: ${error.message}`);
    }
  }, [faceDetected, capturingPhoto, uploadPhotoAndCreateUser, modelsLoaded]);

  useEffect(() => {
    if (cameraPermission) {
      loadModelsAndDetect();
      const interval = setInterval(loadModelsAndDetect, 2000);
      return () => clearInterval(interval);
    }
  }, [cameraPermission, loadModelsAndDetect]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="camera-setup"
    >
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/png"
        onUserMedia={() => setCameraPermission(true)}
        onUserMediaError={() => setError("Camera permission denied!")}
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: "user",
        }}
      />
      <p>
        {error
          ? error
          : !modelsLoaded
          ? "Loading face detection models..."
          : capturingPhoto
          ? "Capturing your photo..."
          : faceDetected
          ? "Face detected! Setting up your profile..."
          : "Please show your face to start"}
      </p>
    </motion.div>
  );
};

export default CameraSetup;
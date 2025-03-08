import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { uploadVideo } from "../service/cloudinaryService";

const Camera = ({ userId }) => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [videoChunks, setVideoChunks] = useState([]);
  const [videoURL, setVideoURL] = useState("");

  const startRecording = useCallback(() => {
    setVideoChunks([]);
    setRecording(true);

    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setVideoChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorderRef.current.start();
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  }, []);

  const uploadRecordedVideo = async () => {
    if (!userId) {
      alert("User ID not found, please refresh the page.");
      return;
    }

    const videoBlob = new Blob(videoChunks, { type: "video/webm" });
    const videoFile = new File([videoBlob], "recorded-video.webm", {
      type: "video/webm",
    });

    const uploadedURL = await uploadVideo(userId, videoFile);
    setVideoURL(uploadedURL);
  };

  return (
    <div>
      <Webcam ref={webcamRef} />
      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
      {videoChunks.length > 0 && <button onClick={uploadRecordedVideo}>Upload Video</button>}
      {videoURL && <video src={videoURL} controls />}
    </div>
  );
};

export default Camera;

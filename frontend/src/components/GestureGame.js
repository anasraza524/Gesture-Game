import React, { useRef, useEffect, useState } from "react";
import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";

const GestureGame = () => {
  const webcamRef = useRef(null);
  const [gesture, setGesture] = useState("");

  useEffect(() => {
    const runHandpose = async () => {
      const net = await handpose.load();
      setInterval(() => detectGesture(net), 1000);
    };
    runHandpose();
  }, []);

  const detectGesture = async (net) => {
    const video = webcamRef.current.video;
    const predictions = await net.estimateHands(video);

    if (predictions.length > 0) {
      const thumb = predictions[0].landmarks[4];
      const index = predictions[0].landmarks[8];

      if (thumb[1] < index[1]) setGesture("Thumbs Up");
      else setGesture("Unknown");
    }
  };

  return (
    <div>
      <Webcam ref={webcamRef} />
      <h3>Gesture: {gesture}</h3>
    </div>
  );
};

export default GestureGame;

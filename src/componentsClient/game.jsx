import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import reactIcon from "../assets/react.svg";
import videoplayback from "../assets/videoplayback.mp4";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

function Game() {
  const nav = useNavigate();
  const cameraVideoRef = useRef(null);
  const referenceVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const [showButton, setShowButton] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [movementDetected, setMovementDetected] = useState(false);
  const previousLandmarksRef = useRef(null);

  // Initialize PoseLandmarker
  const initPoseLandmarker = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          },
          runningMode: "VIDEO",
          numPoses: 1,
        }
      );

      getVideo();
    } catch (error) {
      console.error("Error initializing PoseLandmarker:", error);
    }
  };

  // Get camera feed
  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        const video = cameraVideoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Initialize game
  useEffect(() => {
    initPoseLandmarker();
  }, []);

  // Movement detection using pose landmarks
  useEffect(() => {
    let animationId;
    if (isRunning && poseLandmarkerRef.current && cameraVideoRef.current) {
      const detectMovement = () => {
        if (
          poseLandmarkerRef.current &&
          cameraVideoRef.current &&
          canvasRef.current
        ) {
          const now = performance.now();
          const results = poseLandmarkerRef.current.detectForVideo(
            cameraVideoRef.current,
            now
          );

          const ctx = canvasRef.current.getContext("2d");
          const videoWidth = cameraVideoRef.current.videoWidth;
          const videoHeight = cameraVideoRef.current.videoHeight;

          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;

          ctx.clearRect(0, 0, videoWidth, videoHeight);
          ctx.save();
          ctx.scale(-1, 1);
          ctx.translate(-videoWidth, 0);

          if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];

            // Draw pose points
            ctx.fillStyle = "orange";
            landmarks.forEach((point) => {
              const x = point.x * videoWidth;
              const y = point.y * videoHeight;
              ctx.beginPath();
              ctx.arc(x, y, 5, 0, 2 * Math.PI);
              ctx.fill();
            });

            // Draw pose connections
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            const connections = [
              [11, 12],
              [12, 14],
              [14, 16],
              [11, 13],
              [13, 15],
              [12, 24],
              [11, 23],
              [23, 24],
              [24, 26],
              [26, 28],
              [28, 32],
              [23, 25],
              [25, 27],
              [27, 31],
            ];
            connections.forEach(([start, end]) => {
              const p1 = landmarks[start];
              const p2 = landmarks[end];
              ctx.beginPath();
              ctx.moveTo(p1.x * videoWidth, p1.y * videoHeight);
              ctx.lineTo(p2.x * videoWidth, p2.y * videoHeight);
              ctx.stroke();
            });
            ctx.restore();

            // Detect movement by comparing landmark positions
            if (previousLandmarksRef.current) {
              let totalMovement = 0;
              for (let i = 0; i < landmarks.length; i++) {
                const dx =
                  landmarks[i].x - previousLandmarksRef.current[i].x;
                const dy =
                  landmarks[i].y - previousLandmarksRef.current[i].y;
                totalMovement += Math.sqrt(dx * dx + dy * dy);
              }

              // If significant movement detected, award points
              const movementThreshold = 0.02; // Threshold for movement
              if (totalMovement > movementThreshold) {
                if (!movementDetected) {
                  setMovementDetected(true);
                  setScore((prev) => prev + 10);
                  setTimeout(() => setMovementDetected(false), 500);
                }
              }
            }

            previousLandmarksRef.current = landmarks;
          }
        }

        animationId = requestAnimationFrame(detectMovement);
      };

      detectMovement();
    }

    return () => cancelAnimationFrame(animationId);
  }, [isRunning, movementDetected]);

  const handlePlayClick = () => {
    setShowButton(false);
    setIsRunning(true);
    // Start reference video
    if (referenceVideoRef.current) {
      referenceVideoRef.current.play();
    }
  };

  const handleStopGame = () => {
    setIsRunning(false);
    setShowButton(true);
    setScore(0);
  };

  return (
    <div
      className="position-relative"
      style={{ width: "100%", height: "100vh" }}
    >
      {/* Camera Feed - Top Layer */}
      <video
        ref={cameraVideoRef}
        autoPlay
        playsInline
        muted
        className="position-fixed top-0 start-0"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 10,
          transform: "scaleX(-1)",
        }}
      />

      {/* Canvas for Pose Drawing - Overlay */}
      <canvas
        ref={canvasRef}
        className="position-fixed top-0 start-0"
        style={{
          width: "100%",
          height: "100%",
          zIndex: 11,
        }}
        width={640}
        height={480}
      />

      {/* Reference Video - Background Layer */}
      {isRunning && (
        <video
          ref={referenceVideoRef}
          className="position-fixed"
          style={{
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            zIndex: 1,
            objectFit: "cover",
          }}
          controls
          loop
        >
          {/* Add your reference video source */}
          <source src={videoplayback} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Score Display */}
      {isRunning && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "20px 30px",
            borderRadius: "10px",
            zIndex: 20,
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          <div>Score: {score}</div>
        </div>
      )}

      {/* Play Button */}
      {showButton && (
        <button
          type="button"
          className="btn fw-bold text-white position-absolute top-50 start-50 translate-middle"
          style={{
            padding: "15px 40px",
            fontSize: "18px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#36e3d7",
            zIndex: 15,
          }}
          onClick={handlePlayClick}
        >
          Play Game
        </button>
      )}

      {/* Stop Button */}
      {isRunning && (
        <button
          type="button"
          className="btn fw-bold text-white position-absolute bottom-0 start-50 translate-middle-x"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#ff6b6b",
            zIndex: 15,
            marginBottom: "20px",
          }}
          onClick={handleStopGame}
        >
          Stop Game
        </button>
      )}

      {/* Movement Indicator */}
      {isRunning && movementDetected && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            left: "20px",
            backgroundColor: "#4caf50",
            color: "white",
            padding: "10px 15px",
            borderRadius: "5px",
            zIndex: 15,
            fontWeight: "bold",
            animation: "pulse 0.5s",
          }}
        >
          ✓ Movement Detected +10 points
        </div>
      )}
    </div>
  );
}

export default Game;

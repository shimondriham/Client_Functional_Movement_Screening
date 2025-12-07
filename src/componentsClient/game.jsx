import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import reactIcon from "../assets/react.svg";
import videoplayback from "../assets/videoplayback.mp4";

function Game() {
  const nav = useNavigate();
  const cameraVideoRef = useRef(null);
  const referenceVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showButton, setShowButton] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [movementDetected, setMovementDetected] = useState(false);

  // Get camera feed
  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 } })
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
    getVideo();
  }, [cameraVideoRef]);

  // Movement detection (basic pixel difference detection)
  useEffect(() => {
    let animationId;
    if (isRunning && canvasRef.current && cameraVideoRef.current) {
      const detectMovement = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const video = cameraVideoRef.current;

        // Draw current frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get pixel data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Simple movement detection: count pixels that changed significantly
        let changedPixels = 0;
        for (let i = 0; i < data.length; i += 4) {
          // Check brightness change
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness > 50 && brightness < 200) {
            changedPixels++;
          }
        }

        // If significant movement detected, award points
        const movementThreshold = data.length * 0.05; // 5% of pixels changed
        if (changedPixels > movementThreshold) {
          if (!movementDetected) {
            setMovementDetected(true);
            setScore((prev) => prev + 10); // Award 10 points for movement
            setTimeout(() => setMovementDetected(false), 500); // Reset after 500ms
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
      {/* Camera Feed - Bottom Layer */}
      <video
        ref={cameraVideoRef}
        className="position-fixed top-0 start-0"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 10,
        }}
      />

      {/* Hidden Canvas for Movement Detection */}
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width={1280}
        height={720}
      />

      {/* Reference Video - Top Layer */}
      {isRunning && (
        <video
          ref={referenceVideoRef}
          className="position-fixed"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
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

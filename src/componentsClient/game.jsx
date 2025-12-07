import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import backgroundVideo from "../assets/videoplayback.mp4";

function Game() {
  const nav = useNavigate();
  const videoRef = useRef(null);
  const backgroundVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const animationIdRef = useRef(null);

  const [showButton, setShowButton] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    initPoseLandmarker();
    getVideo();

    return () => {
      // Cleanup
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      startGame();
    } else {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    }
  }, [isRunning]);

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
      console.log("PoseLandmarker initialized successfully");
    } catch (error) {
      console.error("Error initializing PoseLandmarker:", error);
    }
  };

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
            console.log("Camera started successfully");
          };
        }
      })
      .catch((err) => {
        console.error("Camera access error:", err);
      });
  };

  const startGame = () => {
    console.log("Starting game...");
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.play();
      console.log("Background video playing");
    }
    processFrames();
  };

  const processFrames = () => {
    const loop = () => {
      if (!isRunning) {
        return;
      }

      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (canvas && video && video.readyState >= 2) {
        const ctx = canvas.getContext("2d");
        
        // Set canvas size to match window
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }

        // Clear canvas with transparency
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate dimensions to maintain aspect ratio and center the feed
        const videoAspect = video.videoWidth / video.videoHeight;
        const canvasAspect = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (canvasAspect > videoAspect) {
          drawHeight = canvas.height;
          drawWidth = drawHeight * videoAspect;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        } else {
          drawWidth = canvas.width;
          drawHeight = drawWidth / videoAspect;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        }

        ctx.save();
        
        // Mirror the entire canvas
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        // Draw the camera feed
        ctx.drawImage(
          video,
          offsetX,
          offsetY,
          drawWidth,
          drawHeight
        );

        ctx.restore();

        // Process pose detection
        if (poseLandmarkerRef.current) {
          try {
            const now = performance.now();
            const results = poseLandmarkerRef.current.detectForVideo(video, now);

            // Draw skeleton if person detected
            if (results.landmarks && results.landmarks.length > 0) {
              const landmarks = results.landmarks[0];

              ctx.save();
              
              // Mirror for skeleton
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);

              // Draw skeleton connections
              ctx.strokeStyle = "rgba(54, 227, 215, 0.8)";
              ctx.lineWidth = 4;
              const connections = [
                [11, 12], [12, 14], [14, 16], [11, 13], [13, 15],
                [12, 24], [11, 23], [23, 24],
                [24, 26], [26, 28], [28, 32], [23, 25], [25, 27], [27, 31],
              ];

              connections.forEach(([start, end]) => {
                const p1 = landmarks[start];
                const p2 = landmarks[end];
                
                const x1 = offsetX + p1.x * drawWidth;
                const y1 = offsetY + p1.y * drawHeight;
                const x2 = offsetX + p2.x * drawWidth;
                const y2 = offsetY + p2.y * drawHeight;
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
              });

              // Draw skeleton points
              ctx.fillStyle = "rgba(255, 165, 0, 0.9)";
              landmarks.forEach((point) => {
                const x = offsetX + point.x * drawWidth;
                const y = offsetY + point.y * drawHeight;
                
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, 2 * Math.PI);
                ctx.fill();
              });

              ctx.restore();
            }
          } catch (error) {
            console.error("Error processing frame:", error);
          }
        }
      }

      animationIdRef.current = requestAnimationFrame(loop);
    };

    loop();
  };

  const handleBack = () => {
    setIsRunning(false);
    setShowButton(true);
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.pause();
      backgroundVideoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="position-relative" style={{ width: "100vw", height: "100vh", overflow: "hidden", backgroundColor: "#000" }}>
      {/* Background Video Layer (Layer 1) */}
      <video
        ref={backgroundVideoRef}
        className="position-absolute top-0 start-0"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          zIndex: 1,
        }}
        loop
        muted
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* Hidden Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: "none" }}
      />

      {/* Canvas Layer for Camera Feed + Skeleton (Layer 2) */}
      <canvas
        ref={canvasRef}
        className="position-absolute top-0 start-0"
        style={{
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* UI Overlay (Layer 3) */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 3, pointerEvents: "none" }}>
        {/* Start Button */}
        {showButton && (
          <button
            type="button"
            className="btn fw-bold text-white position-absolute top-50 start-50 translate-middle"
            style={{
              padding: "20px 40px",
              fontSize: "24px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#36e3d7",
              pointerEvents: "auto",
              boxShadow: "0 4px 15px rgba(54, 227, 215, 0.4)",
            }}
            onClick={() => {
              setShowButton(false);
              setIsRunning(true);
            }}
          >
            Play
          </button>
        )}

        {/* Back Button */}
        {isRunning && (
          <button
            className="btn btn-secondary position-absolute bottom-0 start-0 m-4"
            style={{ pointerEvents: "auto" }}
            onClick={handleBack}
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}

export default Game;

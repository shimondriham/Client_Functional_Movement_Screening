import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import reactIcon from "../assets/react.svg";

function Game() {
  const nav = useNavigate();
  const videoRef = useRef(null);
  const backgroundVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseLandmarkerRef = useRef(null);

  const [showButton, setShowButton] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [gameState, setGameState] = useState("idle"); // idle, playing, paused, ended

  // Game rules state
  const [targetPose, setTargetPose] = useState(null);
  const [poseTimer, setPoseTimer] = useState(0);

  useEffect(() => {
    initPoseLandmarker();
    getVideo();

    return () => {
      // Cleanup
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      startGame();
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
    } catch (error) {
      console.error("Error initializing PoseLandmarker:", error);
    }
  };

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("Camera access error:", err);
      });
  };

  const startGame = () => {
    setGameState("playing");
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.play();
    }
    generateNewTargetPose();
    processFrames();
  };

  const generateNewTargetPose = () => {
    // Define different target poses
    const poses = [
      { name: "Arms Up", type: "armsUp" },
      { name: "Arms Out", type: "armsOut" },
      { name: "Squat", type: "squat" },
      { name: "Left Arm Up", type: "leftArmUp" },
      { name: "Right Arm Up", type: "rightArmUp" },
    ];

    const randomPose = poses[Math.floor(Math.random() * poses.length)];
    setTargetPose(randomPose);
    setPoseTimer(5); // 5 seconds to complete pose
  };

  const checkPoseMatch = (landmarks) => {
    if (!targetPose || !landmarks) return false;

    // Get key landmarks
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];

    const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipMidY = (leftHip.y + rightHip.y) / 2;

    switch (targetPose.type) {
      case "armsUp":
        // Both wrists above shoulders
        return (
          leftWrist.y < leftShoulder.y - 0.1 &&
          rightWrist.y < rightShoulder.y - 0.1
        );

      case "armsOut":
        // Both arms extended horizontally
        const leftArmHorizontal = Math.abs(leftWrist.y - leftShoulder.y) < 0.1;
        const rightArmHorizontal =
          Math.abs(rightWrist.y - rightShoulder.y) < 0.1;
        return leftArmHorizontal && rightArmHorizontal;

      case "squat":
        // Knees bent, hips lowered
        const hipKneeDistance = Math.abs(
          hipMidY - (leftKnee.y + rightKnee.y) / 2
        );
        return hipKneeDistance < 0.2;

      case "leftArmUp":
        return leftWrist.y < leftShoulder.y - 0.1;

      case "rightArmUp":
        return rightWrist.y < rightShoulder.y - 0.1;

      default:
        return false;
    }
  };

  const processFrames = () => {
    let animationId;
    let lastPoseCheckTime = Date.now();
    let poseHoldTime = 0;
    const POSE_HOLD_DURATION = 1000; // Hold pose for 1 second to score

    const loop = () => {
      if (!isRunning || gameState !== "playing") {
        cancelAnimationFrame(animationId);
        return;
      }

      if (poseLandmarkerRef.current && videoRef.current) {
        const now = performance.now();
        const results = poseLandmarkerRef.current.detectForVideo(
          videoRef.current,
          now
        );

        const ctx = canvasRef.current.getContext("2d");
        const canvas = canvasRef.current;
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];

          // Draw skeleton
          ctx.save();
          const scaleX = canvas.width / videoWidth;
          const scaleY = canvas.height / videoHeight;

          // Mirror effect
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);

          // Draw connections
          ctx.strokeStyle = "rgba(54, 227, 215, 0.8)";
          ctx.lineWidth = 4;
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
            ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
            ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
            ctx.stroke();
          });

          // Draw points
          ctx.fillStyle = "rgba(255, 165, 0, 0.9)";
          landmarks.forEach((point) => {
            ctx.beginPath();
            ctx.arc(
              point.x * canvas.width,
              point.y * canvas.height,
              6,
              0,
              2 * Math.PI
            );
            ctx.fill();
          });

          ctx.restore();

          // Check pose match
          const currentTime = Date.now();
          const isPoseCorrect = checkPoseMatch(landmarks);

          if (isPoseCorrect) {
            poseHoldTime += currentTime - lastPoseCheckTime;
            setFeedback(
              `Hold it! ${((POSE_HOLD_DURATION - poseHoldTime) / 1000).toFixed(
                1
              )}s`
            );

            if (poseHoldTime >= POSE_HOLD_DURATION) {
              // Score!
              setScore((prev) => prev + 10);
              setFeedback("Perfect! +10 points");
              poseHoldTime = 0;
              setTimeout(() => generateNewTargetPose(), 500);
            }
          } else {
            poseHoldTime = 0;
            setFeedback(`Do: ${targetPose?.name || "Loading..."}`);
          }

          lastPoseCheckTime = currentTime;
        } else {
          setFeedback("No person detected");
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();
  };

  return (
    <div
      className="position-relative"
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    >
      {/* Background Video Layer */}
      <video
        ref={backgroundVideoRef}
        className="position-absolute top-0 start-0"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
        }}
        loop
        muted
      >
        {/* Add your background video source */}
        <source src="/path-to-your-background-video.mp4" type="video/mp4" />
      </video>

      {/* Hidden Camera Feed */}
      <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />

      {/* Canvas Layer for Pose Overlay */}
      <canvas
        ref={canvasRef}
        className="position-absolute top-0 start-0"
        style={{
          width: "100%",
          height: "100%",
          zIndex: 2,
        }}
      />

      {/* UI Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ zIndex: 3, pointerEvents: "none" }}
      >
        {/* Score Display */}
        {isRunning && (
          <div className="position-absolute top-0 start-0 m-4 p-3 bg-dark bg-opacity-75 rounded text-white">
            <h2 className="mb-0">Score: {score}</h2>
          </div>
        )}

        {/* Target Pose Display */}
        {isRunning && targetPose && (
          <div className="position-absolute top-0 end-0 m-4 p-3 bg-dark bg-opacity-75 rounded text-white text-center">
            <h4 className="mb-2">{targetPose.name}</h4>
            <p className="mb-0 small">{feedback}</p>
          </div>
        )}

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
            Start Game
          </button>
        )}

        {/* Back Button */}
        <button
          className="btn btn-secondary position-absolute bottom-0 start-0 m-4"
          style={{ pointerEvents: "auto" }}
          onClick={() => nav("/")}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}

export default Game;

import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import reactIcon from "../assets/react.svg";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { doApiGet, doApiMethod } from "../services/apiService";

function Game2() {
  const nav = useNavigate();
  const location = useLocation();
  const idGame = location.state?.gameId;
  // const fromPage = location.state?.from;
  const p11Y = useRef(null);
  const p13Y = useRef(null);
  const videoRef = useRef(null);
  const guideVideoRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameArr, setGameArr] = useState([false, false, false]);
  const isValid = useRef(false);
  const timerIntervalRef = useRef(null);
  const processLoopRef = useRef(null);
  const [myInfo, setmyInfo] = useState({});

  // -------------------------------
  // CAMERA START
  // -------------------------------
  const startCamera = async () => {
    if (!videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
      };
    } catch (err) {
      console.error("Camera access error:", err);
    }
  };

  // -------------------------------
  // INIT POSE LANDMARKER
  // -------------------------------
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

  // -------------------------------
  // PROCESS LANDMARKS
  // -------------------------------
  const processLandmarks = () => {
    if (!poseLandmarkerRef.current || !videoRef.current) return;

    const now = performance.now();
    const results = poseLandmarkerRef.current.detectForVideo(
      videoRef.current,
      now
    );
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;

    if (!results.landmarks || results.landmarks.length === 0) {
      setFeedback("No person detected");
      return;
    }

    const landmarks = results.landmarks[0];

    // Check shoulder positions (landmarks 11 and 12)
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    p11Y.current = leftShoulder.y;
    p13Y.current = rightShoulder.y;

    const pixel11Y = p11Y.current * videoHeight;
    const pixel12Y = p13Y.current * videoHeight;
    const isBendingDown =
      pixel11Y >= videoHeight * 0.3 && pixel12Y >= videoHeight * 0.3;

    if (!isBendingDown) setFeedback("Bend bit more down");
    else setFeedback("Perfect!");
  };

  // -------------------------------
  // INIT SELFIE SEGMENTATION
  // -------------------------------
  const initSelfieSegmentation = async () => {
    try {
      await startCamera();

      // Start continuous pose detection loop
      const processLoop = () => {
        if (videoRef.current && poseLandmarkerRef.current) {
          processLandmarks();
        }
        processLoopRef.current = requestAnimationFrame(processLoop);
      };
      processLoopRef.current = requestAnimationFrame(processLoop);
    } catch (err) {
      console.error("Failed to init camera", err);
    }
  };

  // -------------------------------
  // USE EFFECT INIT
  // -------------------------------
  useEffect(() => {
    console.log(idGame);

    doApi();
    initSelfieSegmentation();
    initPoseLandmarker();
  }, []);

  const doApi = async () => {
    let url = "/users/myInfo";
    try {
      let data = await doApiGet(url);
      setmyInfo(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const startGame = async () => {
    setIsPlaying(true);
    setElapsedTime(0);
    setGameArr([false, false, false]);

    // Start the timer with timestamp
    const startTime = Date.now();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);
      console.log("Elapsed time:", elapsed, "ms");

      // Check feedback and set arr dynamically based on window size
      // windowSize (ms) defines how long each slot lasts (5000ms -> 5s windows)
      const windowSize = 5000;
      const idx = Math.floor(elapsed / windowSize);
      if (feedback === "Perfect!" && idx >= 0 && idx < gameArr.length) {
        setGameArr((prev) => {
          if (prev[idx]) return prev; // already set
          const next = [...prev];
          next[idx] = true;
          return next;
        });
      }
    }, 100);

    // Don't pause the selfie segmentation processing
    if (guideVideoRef.current) {
      guideVideoRef.current
        .play()
        .catch((err) => console.error("Guide video play error:", err));
    }
    // Ensure camera is running and segmentation continues
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current
        .play()
        .catch((err) => console.error("Camera play error:", err));
    }
  };

  const stopCamera = () => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
      // Stop the timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    } catch (err) {
      console.warn("Error stopping camera:", err);
    }
  };

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 60px)",
        overflow: "hidden",
        background: "black",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Live Camera - Small in bottom right */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            width: "20%",
            height: "auto",
            maxHeight: "30%",
            objectFit: "cover",
            transform: "scaleX(-1)",
            borderRadius: 8,
            border: "2px solid white",
            zIndex: 3,
          }}
        />

        {/* Background MP4 - Large, full screen */}
        <video
          ref={guideVideoRef}
          src="src/assets/videoplayback.mp4"
          muted
          playsInline
          onEnded={() => {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            // send to backend route /games
            (async () => {
              let dataBody = {
                _id: idGame,
                name: "game2",
                game: gameArr,
              };
              try {
                console.log(idGame);

                let data = await doApiMethod(
                  "/games/updateGame/",
                  "PATCH",
                  dataBody
                );
                console.log(data.data);

                if (data.status === 200) {
                  console.log("Game data updated successfully");
                  isValid.current = true;
                }
                console.log("arr sent to /games", gameArr);
              } catch (err) {
                console.error("Failed to send arr to backend:", err);
              }
            })();
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
          }}
        />

        {/* Feedback */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#F2743E",
            fontWeight: "bold",
            fontSize: 22,
            padding: "12px 24px",
            zIndex: 100,
          }}
        >
          {feedback}
        </div>

        {!isPlaying && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <button
              onClick={startGame}
              style={{
                padding: "18px 32px",
                fontSize: 22,
                fontWeight: "bold",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: "#F2743E",
                color: "white",
              }}
            >
              Start
            </button>
          </div>
        )}
      </div>

      {/* Continue Button */}
      <button
        onClick={() => {
          stopCamera();
          (async () => {
            try {
              if (!idGame) {
                console.warn("No game id available to fetch current game");
                nav("/performanceAnalysis", {
                  state: { gameId: idGame, from: "game2" },
                });
                return;
              }
              const resp = await doApiGet(`/currentGame/${idGame}`);
              const currentGame = resp && resp.data ? resp.data : null;
              console.log("Fetched current game before navigate:", currentGame);
              nav("/performanceAnalysis", {
                state: { gameId: idGame, from: "game2", gameData: currentGame },
              });
            } catch (err) {
              console.error("Failed to fetch current game:", err);
              nav("/performanceAnalysis", {
                state: { gameId: idGame, from: "game2" },
              });
            }
          })();
          console.log("Navigating to performanceAnalysis with gameId:", idGame);
        }}
        disabled={!isValid.current}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          padding: "12px 24px",
          background: "#F2743E",
          color: "white",
          border: "none",
          borderRadius: 6,
          fontWeight: "bold",
          zIndex: 4,
        }}
      >
        Continue
      </button>
    </div>
  );
}

export default Game2;

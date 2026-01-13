import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { doApiGet, doApiMethod } from "../services/apiService";

function Game2() {
  const nav = useNavigate();
  const location = useLocation();
  const idGame = location.state?.gameId;
  const videoRef = useRef(null);
  const guideVideoRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [gameArr, setGameArr] = useState([false, false, false]);
  const isValid = useRef(false);
  const timerIntervalRef = useRef(null);
  const processLoopRef = useRef(null);
  const [myInfo, setmyInfo] = useState({});

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


  const initSelfieSegmentation = async () => {
    try {
      await startCamera();
      const processLoop = () => {
        processLoopRef.current = requestAnimationFrame(processLoop);
      };
      processLoopRef.current = requestAnimationFrame(processLoop);
    } catch (err) {
      console.error("Failed to init camera", err);
    }
  };

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
      setGameArr([false, false, false]);

      setTimeout(() => {
      if (guideVideoRef.current) {
        guideVideoRef.current
          .play()
          .catch(err => console.error('Guide video play error:', err));
      }

      if (videoRef.current && videoRef.current.paused) {
        videoRef.current
          .play()
          .catch(err => console.error('Camera play error:', err));
      }

      const startTime = Date.now();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (!poseLandmarkerRef.current || !videoRef.current) return;
      const now = performance.now();
      const results = poseLandmarkerRef.current.detectForVideo(videoRef.current, now);

      if (!results.landmarks || results.landmarks.length === 0) {
        setFeedback('No person detected');
        return;
      }

      const landmarks = results.landmarks[0];
      const isRightPosition = (landmarks[12].x <= 0.40);
      const isLeftPosition = (landmarks[11].x >= 0.92);
      if (elapsed >= 1000 && elapsed <= 15000 && !isLeftPosition) setFeedback('Move to the left');
      else if (elapsed >= 1000 && elapsed <= 15000 && isLeftPosition) setFeedback('Perfect!');
      else if (elapsed >= 15000 && elapsed <= 25000 && !isRightPosition) setFeedback('Move to the right');
      else if (elapsed >= 15000 && elapsed <= 25000 && isRightPosition) setFeedback('Perfect!');
      else if (elapsed >= 25000 && elapsed <= 30000 && !isLeftPosition) setFeedback('Move to the left');
      else if (elapsed >= 25000 && elapsed <= 30000 && isLeftPosition) setFeedback('Perfect!');
      

      if (elapsed >= 1000 && elapsed <= 8000) {
        if (feedback === 'Perfect!') {
          setGameArr(prev => [true, prev[1], prev[2]]);
        }
      } else if (elapsed > 15000 && elapsed <= 20000) {
        if (feedback === 'Perfect!') {
          setGameArr(prev => [prev[0], true, prev[2]]);
        }
      } else if (elapsed > 25000 && elapsed <= 30000) {
        if (feedback === 'Perfect!') {
          setGameArr(prev => [prev[0], prev[1], true]);
        }
      }
    }, 100);
  }, 3000);
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
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    } catch (err) {
      console.warn("Error stopping camera:", err);
    }
  };

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
        <video
          ref={guideVideoRef}
          src="src/assets/game2_video.mp4"
          muted
          playsInline
          onEnded={() => {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
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

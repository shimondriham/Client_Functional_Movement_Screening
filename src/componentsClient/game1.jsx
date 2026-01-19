import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { doApiGet, doApiMethod } from '../services/apiService';

function Game1() {
  const nav = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const guideVideoRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [idGame, setIdGame] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameArr, setGameArr] = useState([false, false, false]);
  const isValid = useRef(false);
  const processLoopRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const [myInfo, setmyInfo] = useState({});
  const noDetectionCountRef = useRef(0);


  // -------------------------------
  // CAMERA START
  // -------------------------------
  const startCamera = async () => {
    if (!videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
      };
    } catch (err) {
      console.error('Camera access error:', err);
    }
  };

  // -------------------------------
  // DRAW AVATAR FACING FROM THE BACK
  // -------------------------------
  const drawAvatarFromBack = (ctx, landmarks, width, height) => {
    if (!landmarks || landmarks.length === 0) return;

    ctx.save();
    ctx.scale(-1, 1); // Flip horizontally
    ctx.translate(-width, 0); // Shift back after flip

    // Convert normalized coordinates to pixel coordinates
    const getPoint = (index) => ({
      x: landmarks[index].x * width,
      y: landmarks[index].y * height
    });

    // Key points for drawing avatar from back
    const leftShoulder = getPoint(11);
    const rightShoulder = getPoint(12);
    const leftHip = getPoint(23);
    const rightHip = getPoint(24);
    const leftElbow = getPoint(13);
    const rightElbow = getPoint(14);
    const leftWrist = getPoint(15);
    const rightWrist = getPoint(16);
    const leftKnee = getPoint(25);
    const rightKnee = getPoint(26);
    const leftAnkle = getPoint(27);
    const rightAnkle = getPoint(28);
    const nose = getPoint(0);
    const leftEar = getPoint(7);
    const rightEar = getPoint(8);

    // Calculate center points
    const shoulderCenter = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2
    };
    const hipCenter = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2
    };
    const headCenter = {
      x: (leftEar.x + rightEar.x) / 2,
      y: (leftEar.y + rightEar.y) / 2
    };

    // Draw head (back view - circular)
    const headRadius = Math.abs(leftEar.x - rightEar.x) * 0.6;
    ctx.fillStyle = '#8B7355'; // Skin tone
    ctx.beginPath();
    ctx.arc(headCenter.x, headCenter.y - headRadius * 0.3, headRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw hair (back view)
    ctx.fillStyle = '#4A4A4A'; // Dark hair color
    ctx.beginPath();
    ctx.arc(headCenter.x, headCenter.y - headRadius * 0.3, headRadius * 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Draw torso (back view - trapezoid shape)
    const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
    const hipWidth = Math.abs(leftHip.x - rightHip.x);
    const torsoHeight = Math.abs(hipCenter.y - shoulderCenter.y);
    
    ctx.fillStyle = '#2C3E50'; // Shirt color
    ctx.beginPath();
    ctx.moveTo(leftShoulder.x, shoulderCenter.y);
    ctx.lineTo(rightShoulder.x, shoulderCenter.y);
    ctx.lineTo(rightHip.x, hipCenter.y);
    ctx.lineTo(leftHip.x, hipCenter.y);
    ctx.closePath();
    ctx.fill();

    // Draw arms (back view)
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = shoulderWidth * 0.15;
    ctx.lineCap = 'round';
    
    // Left arm
    ctx.beginPath();
    ctx.moveTo(leftShoulder.x, shoulderCenter.y);
    ctx.lineTo(leftElbow.x, leftElbow.y);
    ctx.lineTo(leftWrist.x, leftWrist.y);
    ctx.stroke();
    
    // Right arm
    ctx.beginPath();
    ctx.moveTo(rightShoulder.x, shoulderCenter.y);
    ctx.lineTo(rightElbow.x, rightElbow.y);
    ctx.lineTo(rightWrist.x, rightWrist.y);
    ctx.stroke();

    // Draw hands (back view - simple circles)
    ctx.fillStyle = '#8B7355';
    ctx.beginPath();
    ctx.arc(leftWrist.x, leftWrist.y, shoulderWidth * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rightWrist.x, rightWrist.y, shoulderWidth * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Draw legs (back view)
    ctx.strokeStyle = '#34495E'; // Pants color
    ctx.lineWidth = hipWidth * 0.12;
    
    // Left leg
    ctx.beginPath();
    ctx.moveTo(leftHip.x, hipCenter.y);
    ctx.lineTo(leftKnee.x, leftKnee.y);
    ctx.lineTo(leftAnkle.x, leftAnkle.y);
    ctx.stroke();
    
    // Right leg
    ctx.beginPath();
    ctx.moveTo(rightHip.x, hipCenter.y);
    ctx.lineTo(rightKnee.x, rightKnee.y);
    ctx.lineTo(rightAnkle.x, rightAnkle.y);
    ctx.stroke();

    // Draw feet (back view - simple rectangles)
    ctx.fillStyle = '#1A1A1A'; // Shoe color
    const footWidth = hipWidth * 0.15;
    const footHeight = hipWidth * 0.08;
    ctx.fillRect(leftAnkle.x - footWidth / 2, leftAnkle.y, footWidth, footHeight);
    ctx.fillRect(rightAnkle.x - footWidth / 2, rightAnkle.y, footWidth, footHeight);

    ctx.restore();
  };

  // -------------------------------
  // INIT POSE LANDMARKER
  // -------------------------------
  const initPoseLandmarker = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
        },
        runningMode: 'VIDEO',
        numPoses: 1
      });
    } catch (error) {
      console.error('Error initializing PoseLandmarker:', error);
    }
  };

  const initAvatarRendering = async () => {
    try {
      await startCamera();

      const processLoop = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !poseLandmarkerRef.current) {
          processLoopRef.current = requestAnimationFrame(processLoop);
          return;
        }

        // Check if video has valid dimensions
        if (video.videoWidth === 0 || video.videoHeight === 0) {
          processLoopRef.current = requestAnimationFrame(processLoop);
          return;
        }

        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Detect pose and draw avatar
        try {
          const now = performance.now();
          const results = poseLandmarkerRef.current.detectForVideo(video, now);

          if (results.landmarks && results.landmarks.length > 0) {
            drawAvatarFromBack(ctx, results.landmarks[0], canvas.width, canvas.height);
          }
        } catch (error) {
          // Silently handle errors during processing (video might not be ready)
          console.warn('Pose detection error:', error);
        }

        processLoopRef.current = requestAnimationFrame(processLoop);
      };
      processLoopRef.current = requestAnimationFrame(processLoop);
    } catch (err) {
      console.error('Failed to init avatar rendering', err);
    }
  };

  // -------------------------------
  // USE EFFECT INIT
  // -------------------------------
  useEffect(() => {
    doApi();
    const initialize = async () => {
      await initPoseLandmarker();
      // Wait a bit for pose landmarker to be ready
      setTimeout(() => {
        initAvatarRendering();
      }, 500);
    };
    initialize();
  }, []);


  const doApi = async () => {
    let url = "/users/myInfo";
    try {
      let data = await doApiGet(url);
      setmyInfo(data.data);
    } catch (error) {
      console.log(error);
    }
  }

 
  const startGame = async () => {
  setIsPlaying(true);
  setGameArr([false, false, false]);

  // ⏳ wait 3 seconds before starting video + timer
  setTimeout(() => {
    // ▶️ start guide video
    if (guideVideoRef.current) {
      guideVideoRef.current
        .play()
        .catch(err => console.error('Guide video play error:', err));
    }

    // ▶️ ensure camera keeps running
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current
        .play()
        .catch(err => console.error('Camera play error:', err));
    }

    // ⏱️ start timer AFTER delay
    const startTime = Date.now();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (!poseLandmarkerRef.current || !videoRef.current) return;
      
      // Check if video has valid dimensions before processing
      if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
        return;
      }
      
      const now = performance.now();
      let results;
      try {
        results = poseLandmarkerRef.current.detectForVideo(videoRef.current, now);
      } catch (error) {
        // Silently handle errors during processing
        console.warn('Pose detection error in timer:', error);
        return;
      }

      if (!results.landmarks || results.landmarks.length === 0) {
        noDetectionCountRef.current++;
        if (noDetectionCountRef.current >= 2) {
          setFeedback('No person detected');
        }
        return;
      }
      noDetectionCountRef.current = 0;

      const landmarks = results.landmarks[0];
      const isRightPosition = (landmarks[12].x <= 0.40);
      const isLeftPosition = (landmarks[11].x >= 0.92);
      const leftHand = landmarks[15].y;
      const rightHand = landmarks[16].y;
      const handsAboveShoulders = (leftHand < landmarks[11].y && rightHand < landmarks[12].y);

      if (elapsed >= 1000 && elapsed <= 10000 && !handsAboveShoulders) setFeedback('Raise both hands up and down');
      else if (elapsed >= 1000 && elapsed <= 10000 && handsAboveShoulders) setFeedback('Perfect!');
      else if (elapsed >= 10000 && elapsed <= 20000 && !isLeftPosition) setFeedback('Move to the left');
      else if (elapsed >= 10000 && elapsed <= 20000 && isLeftPosition) setFeedback('Perfect!');
      else if (elapsed >= 20000 && elapsed <= 26000 && !isRightPosition) setFeedback('Move to the right');
      else if (elapsed >= 20000 && elapsed <= 26000 && isRightPosition) setFeedback('Perfect!');
      
      if (elapsed >= 1000 && elapsed <= 10000) {
        if (feedback === 'Perfect!') {
          setGameArr(prev => [true, prev[1], prev[2]]);
        }
      } else if (elapsed > 10000 && elapsed <= 15000) {
        if (feedback === 'Perfect!') {
          setGameArr(prev => [prev[0], true, prev[2]]);
        }
      } else if (elapsed > 20000 && elapsed <= 26000) {
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
      // Stop the timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    } catch (err) {
      console.warn('Error stopping camera:', err);
    }
  };

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div
      style={{
        width: '100%',
        height: 'calc(100vh - 60px)',
        overflow: 'hidden',
        background: 'black'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%'
        }}
      >
        {/* Live Camera */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)',
            opacity: 0
          }}
        />

        {/* Background MP4 */}
        <video
          ref={guideVideoRef}
          src="src/assets/game1_video.mp4"
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
                level: myInfo.difficulty,
                name: "game1",
                game: gameArr,
              };
              try {
                let data = await doApiMethod('/games/', 'POST', dataBody);
                if (data.data._id) {

                  setIdGame(data.data._id);
                  isValid.current = true;

                }
                console.log('arr sent to /games', gameArr);
              } catch (err) {
                console.error('Failed to send arr to backend:', err);
              }
            })();
          }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)',
            opacity: 0.7
          }}
        />

        {/* Pose Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none'
          }}
        />

        {/* Feedback */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#F2743E',
            fontWeight: 'bold',
            fontSize: 22
          }}
        >
          {feedback}
        </div>

        {!isPlaying && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              background: 'rgba(0,0,0,0.3)'
            }}
          >
            <button
              onClick={startGame}
              style={{
                padding: '18px 32px',
                fontSize: 22,
                fontWeight: 'bold',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: '#F2743E',
                color: 'white'
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
          nav('/game2', { state: { gameId: idGame, from: 'game1' } });
          console.log('Navigating to game2 with gameId:', idGame);
          // nav('/' + fromPage);
        }}
        disabled={!isValid.current}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          padding: '12px 24px',
          background: '#F2743E',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontWeight: 'bold',
          zIndex: 4
        }}
      >
        Continue
      </button>
    </div>
  );
}

export default Game1;

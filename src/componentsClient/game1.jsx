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
  const leftStepCompletedRef = useRef(false);
  const rightStepCompletedRef = useRef(false);
  const handsPerfectCountRef = useRef(0);
  const handsWerePerfectRef = useRef(false);


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

    // Calculate center points and dimensions
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
    const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
    const hipWidth = Math.abs(leftHip.x - rightHip.x);
    const torsoHeight = Math.abs(hipCenter.y - shoulderCenter.y);
    const headRadius = Math.abs(leftEar.x - rightEar.x) * 0.6;

    // ========== HEAD & NECK ==========
    // Draw neck (back view)
    const neckWidth = shoulderWidth * 0.25;
    const neckHeight = shoulderCenter.y - headCenter.y - headRadius * 0.5;
    ctx.fillStyle = '#D4A574'; // Skin tone (slightly lighter)
    ctx.fillRect(
      headCenter.x - neckWidth / 2,
      headCenter.y + headRadius * 0.3,
      neckWidth,
      neckHeight
    );

    // Draw head (back view - more oval shape)
    ctx.fillStyle = '#D4A574';
    ctx.beginPath();
    ctx.ellipse(
      headCenter.x,
      headCenter.y - headRadius * 0.2,
      headRadius * 0.85,
      headRadius * 1.1,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // ========== HAIRCUT (Back View) ==========
    // Base hair layer
    ctx.fillStyle = '#2C1810'; // Dark brown hair
    ctx.beginPath();
    ctx.ellipse(
      headCenter.x,
      headCenter.y - headRadius * 0.3,
      headRadius * 0.95,
      headRadius * 1.15,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Hair texture layers (back view - layered effect)
    ctx.fillStyle = '#3D2415';
    for (let i = 0; i < 3; i++) {
      const offsetY = i * headRadius * 0.15;
      const offsetX = (i % 2 === 0 ? 1 : -1) * headRadius * 0.1;
      ctx.beginPath();
      ctx.ellipse(
        headCenter.x + offsetX,
        headCenter.y - headRadius * 0.3 + offsetY,
        headRadius * (0.85 - i * 0.05),
        headRadius * (1.0 - i * 0.08),
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Hair strands/details (back view)
    ctx.strokeStyle = '#1A0F08';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const startX = headCenter.x + Math.cos(angle) * headRadius * 0.6;
      const startY = headCenter.y - headRadius * 0.3 + Math.sin(angle) * headRadius * 0.7;
      const endX = startX + Math.cos(angle) * headRadius * 0.3;
      const endY = startY + Math.sin(angle) * headRadius * 0.2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // ========== CLOTHING - SHIRT ==========
    // Main shirt body
    ctx.fillStyle = '#3498DB'; // Blue shirt color
    ctx.beginPath();
    ctx.moveTo(leftShoulder.x - shoulderWidth * 0.1, shoulderCenter.y);
    ctx.lineTo(rightShoulder.x + shoulderWidth * 0.1, shoulderCenter.y);
    ctx.lineTo(rightHip.x + hipWidth * 0.05, hipCenter.y);
    ctx.lineTo(leftHip.x - hipWidth * 0.05, hipCenter.y);
    ctx.closePath();
    ctx.fill();

    // Shirt collar (back view - V-neck style)
    ctx.fillStyle = '#2980B9'; // Darker blue for collar
    ctx.beginPath();
    ctx.moveTo(headCenter.x - neckWidth * 0.4, shoulderCenter.y);
    ctx.lineTo(headCenter.x, shoulderCenter.y - neckHeight * 0.3);
    ctx.lineTo(headCenter.x + neckWidth * 0.4, shoulderCenter.y);
    ctx.lineTo(headCenter.x + neckWidth * 0.3, shoulderCenter.y + neckHeight * 0.2);
    ctx.lineTo(headCenter.x - neckWidth * 0.3, shoulderCenter.y + neckHeight * 0.2);
    ctx.closePath();
    ctx.fill();

    // ========== ARMS & SLEEVES ==========
    const armWidth = shoulderWidth * 0.18;
    
    // Left sleeve (shirt material)
    ctx.fillStyle = '#3498DB';
    ctx.beginPath();
    ctx.arc(leftShoulder.x, shoulderCenter.y, armWidth * 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    // Right sleeve
    ctx.beginPath();
    ctx.arc(rightShoulder.x, shoulderCenter.y, armWidth * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Upper arms (shirt sleeves)
    ctx.strokeStyle = '#3498DB';
    ctx.lineWidth = armWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(leftShoulder.x, shoulderCenter.y);
    ctx.lineTo(leftElbow.x, leftElbow.y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(rightShoulder.x, shoulderCenter.y);
    ctx.lineTo(rightElbow.x, rightElbow.y);
    ctx.stroke();

    // Forearms (shirt sleeves)
    ctx.lineWidth = armWidth * 0.85;
    ctx.beginPath();
    ctx.moveTo(leftElbow.x, leftElbow.y);
    ctx.lineTo(leftWrist.x, leftWrist.y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(rightElbow.x, rightElbow.y);
    ctx.lineTo(rightWrist.x, rightWrist.y);
    ctx.stroke();

    // Hands (back view - more detailed)
    ctx.fillStyle = '#D4A574';
    const handSize = shoulderWidth * 0.1;
    ctx.beginPath();
    ctx.ellipse(leftWrist.x, leftWrist.y, handSize * 0.8, handSize, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(rightWrist.x, rightWrist.y, handSize * 0.8, handSize, 0, 0, Math.PI * 2);
    ctx.fill();

    // ========== CLOTHING - PANTS ==========
    // Main pants body
    ctx.fillStyle = '#34495E'; // Dark gray/blue pants
    ctx.beginPath();
    ctx.moveTo(leftHip.x - hipWidth * 0.05, hipCenter.y);
    ctx.lineTo(rightHip.x + hipWidth * 0.05, hipCenter.y);
    ctx.lineTo(rightHip.x + hipWidth * 0.08, hipCenter.y + torsoHeight * 0.3);
    ctx.lineTo(leftHip.x - hipWidth * 0.08, hipCenter.y + torsoHeight * 0.3);
    ctx.closePath();
    ctx.fill();

    // Pants pockets (back view)
    ctx.fillStyle = '#2C3E50';
    const pocketWidth = hipWidth * 0.12;
    const pocketHeight = torsoHeight * 0.15;
    
    // Left pocket
    ctx.fillRect(
      leftHip.x - hipWidth * 0.15,
      hipCenter.y + torsoHeight * 0.1,
      pocketWidth,
      pocketHeight
    );
    
    // Right pocket
    ctx.fillRect(
      rightHip.x + hipWidth * 0.03,
      hipCenter.y + torsoHeight * 0.1,
      pocketWidth,
      pocketHeight
    );

    // ========== LEGS ==========
    const legWidth = hipWidth * 0.15;
    
    // Left leg (pants)
    ctx.fillStyle = '#34495E';
    ctx.beginPath();
    ctx.moveTo(leftHip.x, hipCenter.y + torsoHeight * 0.3);
    ctx.lineTo(leftHip.x - legWidth * 0.5, leftKnee.x < leftHip.x ? leftKnee.x - legWidth * 0.3 : leftKnee.x + legWidth * 0.3);
    ctx.lineTo(leftKnee.x, leftKnee.y);
    ctx.lineTo(leftKnee.x, leftKnee.y + legWidth);
    ctx.lineTo(leftHip.x + legWidth * 0.5, leftKnee.x < leftHip.x ? leftKnee.x - legWidth * 0.3 : leftKnee.x + legWidth * 0.3);
    ctx.closePath();
    ctx.fill();
    
    // Left lower leg
    ctx.beginPath();
    ctx.moveTo(leftKnee.x, leftKnee.y);
    ctx.lineTo(leftKnee.x - legWidth * 0.4, leftAnkle.x < leftKnee.x ? leftAnkle.x - legWidth * 0.2 : leftAnkle.x + legWidth * 0.2);
    ctx.lineTo(leftAnkle.x, leftAnkle.y);
    ctx.lineTo(leftAnkle.x, leftAnkle.y + legWidth * 0.8);
    ctx.lineTo(leftKnee.x + legWidth * 0.4, leftAnkle.x < leftKnee.x ? leftAnkle.x - legWidth * 0.2 : leftAnkle.x + legWidth * 0.2);
    ctx.closePath();
    ctx.fill();

    // Right leg (pants)
    ctx.beginPath();
    ctx.moveTo(rightHip.x, hipCenter.y + torsoHeight * 0.3);
    ctx.lineTo(rightHip.x - legWidth * 0.5, rightKnee.x < rightHip.x ? rightKnee.x - legWidth * 0.3 : rightKnee.x + legWidth * 0.3);
    ctx.lineTo(rightKnee.x, rightKnee.y);
    ctx.lineTo(rightKnee.x, rightKnee.y + legWidth);
    ctx.lineTo(rightHip.x + legWidth * 0.5, rightKnee.x < rightHip.x ? rightKnee.x - legWidth * 0.3 : rightKnee.x + legWidth * 0.3);
    ctx.closePath();
    ctx.fill();
    
    // Right lower leg
    ctx.beginPath();
    ctx.moveTo(rightKnee.x, rightKnee.y);
    ctx.lineTo(rightKnee.x - legWidth * 0.4, rightAnkle.x < rightKnee.x ? rightAnkle.x - legWidth * 0.2 : rightAnkle.x + legWidth * 0.2);
    ctx.lineTo(rightAnkle.x, rightAnkle.y);
    ctx.lineTo(rightAnkle.x, rightAnkle.y + legWidth * 0.8);
    ctx.lineTo(rightKnee.x + legWidth * 0.4, rightAnkle.x < rightKnee.x ? rightAnkle.x - legWidth * 0.2 : rightAnkle.x + legWidth * 0.2);
    ctx.closePath();
    ctx.fill();

    // ========== SHOES ==========
    ctx.fillStyle = '#1A1A1A'; // Black shoes
    const footWidth = hipWidth * 0.18;
    const footHeight = hipWidth * 0.12;
    
    // Left shoe (more detailed)
    ctx.beginPath();
    ctx.moveTo(leftAnkle.x - footWidth * 0.4, leftAnkle.y);
    ctx.lineTo(leftAnkle.x + footWidth * 0.6, leftAnkle.y);
    ctx.lineTo(leftAnkle.x + footWidth * 0.5, leftAnkle.y + footHeight);
    ctx.lineTo(leftAnkle.x - footWidth * 0.5, leftAnkle.y + footHeight);
    ctx.closePath();
    ctx.fill();
    
    // Right shoe
    ctx.beginPath();
    ctx.moveTo(rightAnkle.x - footWidth * 0.4, rightAnkle.y);
    ctx.lineTo(rightAnkle.x + footWidth * 0.6, rightAnkle.y);
    ctx.lineTo(rightAnkle.x + footWidth * 0.5, rightAnkle.y + footHeight);
    ctx.lineTo(rightAnkle.x - footWidth * 0.5, rightAnkle.y + footHeight);
    ctx.closePath();
    ctx.fill();

    // Shoe soles
    ctx.fillStyle = '#2C2C2C';
    ctx.fillRect(leftAnkle.x - footWidth * 0.5, leftAnkle.y + footHeight, footWidth, footHeight * 0.3);
    ctx.fillRect(rightAnkle.x - footWidth * 0.5, rightAnkle.y + footHeight, footWidth, footHeight * 0.3);

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
  leftStepCompletedRef.current = false;
  rightStepCompletedRef.current = false;
  handsPerfectCountRef.current = 0;
  handsWerePerfectRef.current = false;

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

      // Update feedback and gameArr based on elapsed time and conditions
      if (elapsed >= 1000 && elapsed <= 10000) {
        if (!handsAboveShoulders) {
          setFeedback('Raise both hands up and down');
          handsWerePerfectRef.current = false; // Reset flag when hands go down so we can count again
        } else {
          setFeedback('Perfect!');
          // Only increment when transitioning from "not perfect" to "perfect" (first time hands go up)
          if (!handsWerePerfectRef.current) {
            handsPerfectCountRef.current++;
            handsWerePerfectRef.current = true;
            // Set to true only after 3 separate times of raising hands up
            if (handsPerfectCountRef.current >= 3) {
              setGameArr(prev => [true, prev[1], prev[2]]);
            }
          }
        }
      } else if (elapsed >= 10000 && elapsed <= 20000) {
        // Left step: once perfect, stay perfect even if they move away
        if (leftStepCompletedRef.current) {
          setFeedback('Perfect!');
        } else if (!isLeftPosition) {
          setFeedback('Move to the left');
        } else {
          setFeedback('Perfect!');
          setGameArr(prev => [prev[0], true, prev[2]]);
          leftStepCompletedRef.current = true;
        }
      } else if (elapsed >= 20000 && elapsed <= 26000) {
        // Right step: once perfect, stay perfect even if they move away
        if (rightStepCompletedRef.current) {
          setFeedback('Perfect!');
        } else if (!isRightPosition) {
          setFeedback('Move to the right');
        } else {
          setFeedback('Perfect!');
          setGameArr(prev => [prev[0], prev[1], true]);
          rightStepCompletedRef.current = true;
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
            color: feedback === 'Perfect!' ? '#2ECC71' : '#F2743E',
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

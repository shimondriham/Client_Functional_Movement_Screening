import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { doApiGet, doApiMethod } from '../services/apiService';

function Game1() {
  const nav = useNavigate();
  const containerRef = useRef(null);
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
  const leftStepCompletedRef = useRef(false);
  const rightStepCompletedRef = useRef(false);
  const handsPositionCountRef = useRef(0);
  const handsWerePerfectUpRef = useRef(false);
  const handsWerePerfectDownRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lastFeedbackVoiceRef = useRef("");
  const voiceRef = useRef(null);
  const bgMusicRef = useRef(new Audio("src/assets/background_music.mp4"));

  const toggleFullscreen = () => {
    const elem = containerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen?.().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.warn('Failed to enter fullscreen:', err);
      });
    } else {
      document.exitFullscreen?.().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.warn('Failed to exit fullscreen:', err);
      });
    }
  };

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

  const drawAvatar = (ctx, landmarks, width, height) => {
    if (!landmarks || landmarks.length === 0) return;

    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-width, 0);

    const getPoint = (index) => ({
      x: landmarks[index].x * width,
      y: landmarks[index].y * height
    });

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
    const leftEar = getPoint(7);
    const rightEar = getPoint(8);

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

    const neckWidth = shoulderWidth * 0.25;
    const neckHeight = shoulderCenter.y - headCenter.y - headRadius * 0.5;
    ctx.fillStyle = '#D4A574';
    ctx.fillRect(
      headCenter.x - neckWidth / 2,
      headCenter.y + headRadius * 0.3,
      neckWidth,
      neckHeight
    );

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

    ctx.fillStyle = '#2C1810';
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

    ctx.fillStyle = '#2f8ac7';
    ctx.beginPath();
    ctx.moveTo(leftShoulder.x - shoulderWidth * 0.1, shoulderCenter.y);
    ctx.lineTo(rightShoulder.x + shoulderWidth * 0.1, shoulderCenter.y);
    ctx.lineTo(rightHip.x + hipWidth * 0.05, hipCenter.y);
    ctx.lineTo(leftHip.x - hipWidth * 0.05, hipCenter.y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#2980B9';
    ctx.beginPath();
    ctx.moveTo(headCenter.x - neckWidth * 0.4, shoulderCenter.y);
    ctx.lineTo(headCenter.x, shoulderCenter.y - neckHeight * 0.3);
    ctx.lineTo(headCenter.x + neckWidth * 0.4, shoulderCenter.y);
    ctx.lineTo(headCenter.x + neckWidth * 0.3, shoulderCenter.y + neckHeight * 0.2);
    ctx.lineTo(headCenter.x - neckWidth * 0.3, shoulderCenter.y + neckHeight * 0.2);
    ctx.closePath();
    ctx.fill();

    const armWidth = shoulderWidth * 0.18;
    ctx.fillStyle = '#2f8ac7';
    ctx.beginPath();
    ctx.arc(leftShoulder.x, shoulderCenter.y, armWidth * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rightShoulder.x, shoulderCenter.y, armWidth * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2f8ac7';
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
    ctx.lineWidth = armWidth * 0.85;
    ctx.beginPath();
    ctx.moveTo(leftElbow.x, leftElbow.y);
    ctx.lineTo(leftWrist.x, leftWrist.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(rightElbow.x, rightElbow.y);
    ctx.lineTo(rightWrist.x, rightWrist.y);
    ctx.stroke();
    ctx.fillStyle = '#D4A574';
    const handSize = shoulderWidth * 0.1;
    ctx.beginPath();
    ctx.ellipse(leftWrist.x, leftWrist.y, handSize * 0.8, handSize, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(rightWrist.x, rightWrist.y, handSize * 0.8, handSize, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#34495E';
    ctx.beginPath();
    ctx.moveTo(leftHip.x - hipWidth * 0.05, hipCenter.y);
    ctx.lineTo(rightHip.x + hipWidth * 0.05, hipCenter.y);
    ctx.lineTo(rightHip.x + hipWidth * 0.08, hipCenter.y + torsoHeight * 0.3);
    ctx.lineTo(leftHip.x - hipWidth * 0.08, hipCenter.y + torsoHeight * 0.3);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#2C3E50';
    const pocketWidth = hipWidth * 0.12;
    const pocketHeight = torsoHeight * 0.15;

    ctx.fillRect(
      leftHip.x - hipWidth * 0.15,
      hipCenter.y + torsoHeight * 0.1,
      pocketWidth,
      pocketHeight
    );

    ctx.fillRect(
      rightHip.x + hipWidth * 0.03,
      hipCenter.y + torsoHeight * 0.1,
      pocketWidth,
      pocketHeight
    );

    const legWidth = hipWidth * 0.15;

    ctx.fillStyle = '#34495E';
    ctx.beginPath();
    ctx.moveTo(leftHip.x, hipCenter.y + torsoHeight * 0.3);
    ctx.lineTo(leftHip.x - legWidth * 0.5, leftKnee.x < leftHip.x ? leftKnee.x - legWidth * 0.3 : leftKnee.x + legWidth * 0.3);
    ctx.lineTo(leftKnee.x, leftKnee.y);
    ctx.lineTo(leftKnee.x, leftKnee.y + legWidth);
    ctx.lineTo(leftHip.x + legWidth * 0.5, leftKnee.x < leftHip.x ? leftKnee.x - legWidth * 0.3 : leftKnee.x + legWidth * 0.3);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(leftKnee.x, leftKnee.y);
    ctx.lineTo(leftKnee.x - legWidth * 0.4, leftAnkle.x < leftKnee.x ? leftAnkle.x - legWidth * 0.2 : leftAnkle.x + legWidth * 0.2);
    ctx.lineTo(leftAnkle.x, leftAnkle.y);
    ctx.lineTo(leftAnkle.x, leftAnkle.y + legWidth * 0.8);
    ctx.lineTo(leftKnee.x + legWidth * 0.4, leftAnkle.x < leftKnee.x ? leftAnkle.x - legWidth * 0.2 : leftAnkle.x + legWidth * 0.2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(rightHip.x, hipCenter.y + torsoHeight * 0.3);
    ctx.lineTo(rightHip.x - legWidth * 0.5, rightKnee.x < rightHip.x ? rightKnee.x - legWidth * 0.3 : rightKnee.x + legWidth * 0.3);
    ctx.lineTo(rightKnee.x, rightKnee.y);
    ctx.lineTo(rightKnee.x, rightKnee.y + legWidth);
    ctx.lineTo(rightHip.x + legWidth * 0.5, rightKnee.x < rightHip.x ? rightKnee.x - legWidth * 0.3 : rightKnee.x + legWidth * 0.3);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(rightKnee.x, rightKnee.y);
    ctx.lineTo(rightKnee.x - legWidth * 0.4, rightAnkle.x < rightKnee.x ? rightAnkle.x - legWidth * 0.2 : rightAnkle.x + legWidth * 0.2);
    ctx.lineTo(rightAnkle.x, rightAnkle.y);
    ctx.lineTo(rightAnkle.x, rightAnkle.y + legWidth * 0.8);
    ctx.lineTo(rightKnee.x + legWidth * 0.4, rightAnkle.x < rightKnee.x ? rightAnkle.x - legWidth * 0.2 : rightAnkle.x + legWidth * 0.2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1A1A1A';
    const footWidth = hipWidth * 0.18;
    const footHeight = hipWidth * 0.12;

    ctx.beginPath();
    ctx.moveTo(leftAnkle.x - footWidth * 0.4, leftAnkle.y);
    ctx.lineTo(leftAnkle.x + footWidth * 0.6, leftAnkle.y);
    ctx.lineTo(leftAnkle.x + footWidth * 0.5, leftAnkle.y + footHeight);
    ctx.lineTo(leftAnkle.x - footWidth * 0.5, leftAnkle.y + footHeight);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(rightAnkle.x - footWidth * 0.4, rightAnkle.y);
    ctx.lineTo(rightAnkle.x + footWidth * 0.6, rightAnkle.y);
    ctx.lineTo(rightAnkle.x + footWidth * 0.5, rightAnkle.y + footHeight);
    ctx.lineTo(rightAnkle.x - footWidth * 0.5, rightAnkle.y + footHeight);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#2C2C2C';
    ctx.fillRect(leftAnkle.x - footWidth * 0.5, leftAnkle.y + footHeight, footWidth, footHeight * 0.3);
    ctx.fillRect(rightAnkle.x - footWidth * 0.5, rightAnkle.y + footHeight, footWidth, footHeight * 0.3);

    ctx.restore();
  };

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
      console.error('Error initializing PoseLandmarker: ', error);
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

        if (video.videoWidth === 0 || video.videoHeight === 0) {
          processLoopRef.current = requestAnimationFrame(processLoop);
          return;
        }

        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        try {
          const now = performance.now();
          const results = poseLandmarkerRef.current.detectForVideo(video, now);

          if (results.landmarks && results.landmarks.length > 0) {
            drawAvatar(ctx, results.landmarks[0], canvas.width, canvas.height);
          }
        } catch (error) {
          console.warn('Pose detection error:', error);
        }

        processLoopRef.current = requestAnimationFrame(processLoop);
      };
      processLoopRef.current = requestAnimationFrame(processLoop);
    } catch (err) {
      console.error('Failed to init avatar rendering', err);
    }
  };

  useEffect(() => {
    doApi();
    const initialize = async () => {
      await initPoseLandmarker();
      setTimeout(() => {
        initAvatarRendering();
      }, 500);
    };
    initialize();
  }, []);


  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const specificVoice = () => {
      const voices = window.speechSynthesis.getVoices?.() || [];
      if (!voices.length) return;
      const females = voices.filter(
        (v) => v.lang.startsWith("en") && 
        /female|woman|zira|susan|samantha|eva|sofia|nova|jenny|aria|helena/i.test(v.name) &&
          !/david|mark|george|michael|daniel|james|guy/i.test(v.name)
      );

      voiceRef.current = females[0] || voices.find((v) => v.lang.startsWith("en")) || null;
    };
    specificVoice();
    window.speechSynthesis.onvoiceschanged = specificVoice;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (!feedback || typeof window === "undefined" || !window.speechSynthesis) return;

    if (feedback === lastFeedbackVoiceRef.current) return;

    lastFeedbackVoiceRef.current = feedback;
    const phrase = new SpeechSynthesisUtterance(feedback);

    if (voiceRef.current) phrase.voice = voiceRef.current;

    phrase.lang = "en-US";

    if (feedback === "Perfect!") {
      phrase.rate = 1.5;
      phrase.pitch = 2.0;
      phrase.volume = 1.0;
    } else {
      phrase.rate = 0.9;
      phrase.pitch = 1.2;
      phrase.volume = 0.9;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(phrase);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [feedback]);


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
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.1;
    bgMusicRef.current.play().catch(err => console.error("Audio play error:", err));

    setIsPlaying(true);
    if (!document.fullscreenElement) {
      toggleFullscreen();
    }

    setIsPlaying(true);
    setGameArr([false, false, false]);
    leftStepCompletedRef.current = false;
    rightStepCompletedRef.current = false;
    handsPositionCountRef.current = 0;
    handsWerePerfectUpRef.current = false;
    handsWerePerfectDownRef.current = false;

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

        if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
          return;
        }
        
        const now = performance.now();
        let results;
        try {
          results = poseLandmarkerRef.current.detectForVideo(videoRef.current, now);
        } catch (error) {
          console.warn('Pose detection error in timer:', error);
          return;
        }

        if (!results.landmarks || results.landmarks.length === 0) {
          setFeedback('No person detected');
          return;
        }
        const landmarks = results.landmarks[0];
        const isRightPosition = (landmarks[10].x < landmarks[24].x);
        const isLeftPosition = (landmarks[9].x > landmarks[23].x);

        if (elapsed >= 1000 && elapsed <= 10000) {
          if (handsPositionCountRef.current < 3) {
            setFeedback(`Raise both hands up and down`);
            const handsAboveShoulders = (landmarks[15].y < landmarks[11].y && landmarks[16].y < landmarks[12].y);
            const handsBelowHips = (landmarks[15].y > landmarks[23].y && landmarks[16].y > landmarks[24].y);

            if (handsAboveShoulders) handsWerePerfectUpRef.current = true;

            if (handsBelowHips && handsWerePerfectUpRef.current) {
              handsPositionCountRef.current++;
              handsWerePerfectUpRef.current = false;
              if (handsPositionCountRef.current >= 3) {
                setFeedback('Perfect!');
                setGameArr(prev => [true, prev[1], prev[2]]);
              }
            }
          } else setFeedback('Perfect!');
        } 
        else if (elapsed >= 10000 && elapsed <= 20000) {
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
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    } catch (err) {
      console.warn('Error stopping camera:', err);
    }
  };

  return (
    <div
      ref={containerRef}
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
        <video
          ref={guideVideoRef}
          src="src/assets/game1_video.mp4"
          muted
          playsInline
          onEnded={() => {
            bgMusicRef.current.pause();
            bgMusicRef.current.currentTime = 0;
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
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
                console.log('Game results sent to /games', gameArr);
              } catch (err) {
                console.error('Failed to send game results to backend:', err);
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
      <button
        onClick={() => {
          stopCamera();
          nav('/game2', { state: { gameId: idGame, from: 'game1' } });
          console.log('Navigating to game2 with gameId: ', idGame);
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
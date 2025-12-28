import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import reactIcon from '../assets/react.svg';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';

function Game1() {
  const nav = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from;
  const p11Y = useRef(null);
  const p13Y = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const guideVideoRef = useRef(null);
  const selfieSegmentationRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState('');
  const isValid = useRef(false);
  const processLoopRef = useRef(null);

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
  // DRAW DRESSED CHARACTER ON BODY
  // -------------------------------
  const drawCharacter = (ctx, segmentationMask, width, height) => {
    if (!segmentationMask) return;

    // קנבס זמני כדי לקרוא פיקסלים
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(segmentationMask, 0, 0, width, height);

    const maskData = tempCtx.getImageData(0, 0, width, height);
    const data = maskData.data;

    ctx.save();
    ctx.scale(-1, 1); // Flip horizontally
    ctx.translate(-width, 0); // Shift back after flip

    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        const idx = (y * width + x) * 4;
        const alpha = data[idx + 3];
        if (alpha > 50) {
          // גוף כחול
          ctx.fillStyle = 'blue';
          ctx.fillRect(x - 4, y - 4, 8, 8);
          // ראש אדום
          ctx.fillStyle = 'gray';
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

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

  // -------------------------------
  // PROCESS LANDMARKS
  // -------------------------------
  const processLandmarks = () => {
    if (!poseLandmarkerRef.current || !videoRef.current) return;
    
    const now = performance.now();
    const results = poseLandmarkerRef.current.detectForVideo(videoRef.current, now);
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;

    if (!results.landmarks || results.landmarks.length === 0) {
      setFeedback('No person detected');
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
    const isBendingDown = (pixel11Y >= videoHeight * 0.3 && pixel12Y >= videoHeight * 0.3);
    
    if (!isValid.current)
      isValid.current = isBendingDown;
    
    if (!isBendingDown) setFeedback('Bend bit more down');
    else setFeedback('Perfect!');
  };

  // -------------------------------
  // INIT SELFIE SEGMENTATION
  // -------------------------------
  const initSelfieSegmentation = async () => {
    try {
      selfieSegmentationRef.current = new SelfieSegmentation({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
      });

      selfieSegmentationRef.current.setOptions({
        modelSelection: 1 // 0 = general, 1 = landscape
      });

      selfieSegmentationRef.current.onResults((results) => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // ציור הדמות במקום האדם
        drawCharacter(ctx, results.segmentationMask, canvas.width, canvas.height);
        
        // Process landmarks for pose detection
        processLandmarks();
      });

      await startCamera();

      // לולאה לשליחת כל פריים
      const processLoop = async () => {
        if (videoRef.current && selfieSegmentationRef.current) {
          await selfieSegmentationRef.current.send({ image: videoRef.current });
        }
        processLoopRef.current = requestAnimationFrame(processLoop);
      };
      processLoopRef.current = requestAnimationFrame(processLoop);
    } catch (err) {
      console.error('Failed to init segmentation', err);
    }
  };

  // -------------------------------
  // USE EFFECT INIT
  // -------------------------------
  useEffect(() => {
    initSelfieSegmentation();
    initPoseLandmarker();
  }, []);

  const startGame = async () => {
    setIsPlaying(true);
    // Don't pause the selfie segmentation processing
    if (guideVideoRef.current) {
      guideVideoRef.current.play().catch(err => console.error('Guide video play error:', err));
    }
    // Ensure camera is running and segmentation continues
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play().catch(err => console.error('Camera play error:', err));
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
          src="src/assets/videoplayback.mp4"
          muted
          playsInline
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
            color: 'deepskyblue',
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
                background: 'deepskyblue',
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
          nav('/' + fromPage);
        }}
        disabled={!isValid.current}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          padding: '12px 24px',
          background: 'rgb(54, 227, 215)',
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

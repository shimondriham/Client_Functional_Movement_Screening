import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import reactIcon from '../assets/react.svg';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

function Game1() {
  const nav = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from;
  const p11Y = useRef(null);
  const p13Y = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const guideVideoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);


  const [feedback, setFeedback] = useState('');
  const isValid = useRef(false);
  const poseLandmarkerRef = useRef(null);

  useEffect(() => {
    let animationId;

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

        startCamera();
      } catch (error) {
        console.error('Error initializing PoseLandmarker:', error);
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
          processFrames();
        };
      } catch (err) {
        console.error('Camera access error:', err);
      }
    };

    const processFrames = () => {
      const loop = () => {
        if (poseLandmarkerRef.current && videoRef.current) {
          const now = performance.now();
          const results = poseLandmarkerRef.current.detectForVideo(videoRef.current, now);
          const videoWidth = videoRef.current.videoWidth;
          const videoHeight = videoRef.current.videoHeight;

          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;

          if (!results.landmarks || results.landmarks.length === 0) {
            setFeedback('No person detected');
          } else {
            const landmarks = results.landmarks[0];
            landmarks.forEach(point => {
              const x = point.x * videoWidth;
              const y = point.y * videoHeight;
            });            
            const connections = [
              [11, 12], [12, 14], [14, 16], [11, 13], [13, 15], // arms
              [11, 12],
              [12, 24], [11, 23], [23, 24], // torso
              [24, 26], [26, 28], [28, 32], [23, 25], [25, 27], [27, 31] // legs
            ];
            connections.forEach(([start, end]) => {
              const p1 = landmarks[start];
              const p2 = landmarks[end];

              if (start === 11 && end === 12) {
                p11Y.current = p1.y;
                p13Y.current = p2.y;
              }
            });

            const pixel11Y = p11Y.current * videoHeight;
            const pixel12Y = p13Y.current * videoHeight;
            const isBendingDown = (pixel11Y >= videoHeight * 0.3 && pixel12Y >= videoHeight * 0.3);
            
            if(!isValid.current)
              isValid.current = isBendingDown;
            
            if (!isBendingDown) setFeedback('Bend bit more down');
            else setFeedback('Perfect!');
          }
        }
        animationId = requestAnimationFrame(loop);
      };
      loop();
    };

    initPoseLandmarker();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  const startGame = async () => {
    setIsPlaying(true);
    await guideVideoRef.current.play();
    await startCamera();
  };
  
const stopCamera = () => {
  try {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  
    if (videoRef.current) {
      videoRef.current.pause();
    }
  } catch (err) {
    console.warn('Error stopping camera:', err);
    }
};

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
          opacity: 0.70
        }}
      />

      {/* Pose Canvas */}
      <canvas
        ref={canvasRef}
        style={{
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

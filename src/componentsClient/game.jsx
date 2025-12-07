import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reactIcon from '../assets/react.svg'; // אם לא בשימוש, אפשר להסיר

function Game() {
  const nav = useNavigate();
  const videoRef = useRef(null);
  const [showButton, setShowButton] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 } })
      .then((stream) => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(err);
      });
  };

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
              [12, 24], [11, 23], [23, 24], // torso
              [24, 26], [26, 28], [28, 32], [23, 25], [25, 27], [27, 31] // legs
            ];
            connections.forEach(([start, end]) => {
              const p1 = landmarks[start];
              const p2 = landmarks[end];

              if (start === 11 && end === 13) {
                p11Y.current = p1.y;
                p13Y.current = p2.y;
              }
            });
            
            const isAboveShoulder =
              p13Y.current < p11Y.current;
            
            if(!isValid.current)
              isValid.current = isAboveShoulder;
            
            if (!isAboveShoulder) setFeedback('Raise your left hand higher');
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
    <div className="position-relative">
      {/* וידאו כרקע במסך מלא, בלי אפקט מראה */}
      <video
        ref={videoRef}
        className="position-fixed top-0 start-0"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      />

      {/* כפתור Play ממורכז עם Bootstrap */}
      {showButton && (
        <button
          type="button"
          className="btn fw-bold text-white position-absolute top-50 start-50 translate-middle"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#36e3d7',
          }}
          onClick={() => {
            setShowButton(false);
            setIsRunning(true);
          }}
        >
          Play
        </button>
      )}
    </div>
  );
}

export default Game;

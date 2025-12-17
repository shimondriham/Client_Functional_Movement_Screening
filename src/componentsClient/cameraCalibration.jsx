import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

function CameraCalibration() {
  const nav = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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

          const ctx = canvasRef.current.getContext('2d');
          const videoWidth = videoRef.current.videoWidth;
          const videoHeight = videoRef.current.videoHeight;

          // Ensure canvas matches video size
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;

          ctx.clearRect(0, 0, videoWidth, videoHeight);
          ctx.save(); // Save current state
          ctx.scale(-1, 1); // Flip horizontally
          ctx.translate(-videoWidth, 0); // Shift back after flip
          if (!results.landmarks || results.landmarks.length === 0) {
            setFeedback('No person detected');
          } else {
            const landmarks = results.landmarks[0];
            ctx.fillStyle = 'orange';
            landmarks.forEach(point => {
              const x = point.x * videoWidth;
              const y = point.y * videoHeight;
              ctx.beginPath();
              ctx.arc(x, y, 5, 0, 2 * Math.PI);
              ctx.fill();
            });

            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            const connections = [
              [11, 12], [12, 14], [14, 16], [11, 13], [13, 15], // arms
              [12, 24], [11, 23], [23, 24], // torso
              [24, 26], [26, 28], [28, 32], [23, 25], [25, 27], [27, 31] // legs
            ];
            connections.forEach(([start, end]) => {
              const p1 = landmarks[start];
              const p2 = landmarks[end];
              ctx.beginPath();
              ctx.moveTo(p1.x * videoWidth, p1.y * videoHeight);
              ctx.lineTo(p2.x * videoWidth, p2.y * videoHeight);
              ctx.stroke();
            });
            ctx.restore();

            // Validation logic
            const xs = landmarks.map(p => p.x);
            const ys = landmarks.map(p => p.y);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);

            const boxHeight = (maxY - minY) * videoHeight;
            const centerX = ((minX + maxX) / 2) * videoWidth;
            const centerY = ((minY + maxY) / 2) * videoHeight;

            const toleranceX = videoWidth * 0.1;
            const toleranceY = videoHeight * 0.1;
            const isCentered =
              Math.abs(centerX - videoWidth / 2) < toleranceX &&
              Math.abs(centerY - videoHeight / 2) < toleranceY;
            const isVisible = boxHeight > videoHeight * 0.6 && boxHeight < videoHeight * 0.95;

            if(!isValid.current)
              isValid.current = isCentered && isVisible;

            if (!isCentered) setFeedback('Move to center');
            else if (!isVisible) setFeedback('Adjust distance');
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
    <div className="d-flex flex-column align-items-center pt-4" style={{ minHeight: '100vh' }}>
      <h4 className="m-2">Camera Calibration</h4>
      <div style={{ position: 'relative', width: '500px', maxWidth: '90%' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '8px',
            transform: 'scaleX(-1)'
          }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      </div>

      <p style={{ marginTop: '10px', fontWeight: 'bold', color: 'blue' }}>{feedback}</p>

      <button
        onClick={() => {stopCamera(); nav('/' + fromPage)}}
        style={{
          width: '120px',
          backgroundColor: 'rgb(54, 227, 215)',
          bottom: '20px',
          position: 'fixed',
          borderColor: 'rgb(54, 227, 215)',
          borderRadius: '5px',
          padding: '10px',
          color: 'white',
          fontWeight: 'bold',
          border: 'none',
          cursor: isValid.current ? 'pointer' : 'not-allowed',
          opacity: isValid.current ? 1 : 0.6
        }}
        // for tests
        // disabled={!isValid.current}
      >
        Continue
      </button>
    </div>
  );
}

export default CameraCalibration;
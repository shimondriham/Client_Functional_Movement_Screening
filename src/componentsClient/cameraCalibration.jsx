import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import reactIcon from '../assets/react.svg';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

function CameraCalibration() {
  const nav = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [feedback, setFeedback] = useState('');
  const [isValid, setIsValid] = useState(false);

  const poseLandmarkerRef = useRef(null); // Keep PoseLandmarker instance persistent

  useEffect(() => {
    let animationId;

    const initPoseLandmarker = async () => {
      try {
        // Load WASM and model
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

          if (!results.landmarks || results.landmarks.length === 0) {
            setFeedback('No person detected');
            setIsValid(false);
          } else {
            const landmarks = results.landmarks[0]; // First pose
            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;

            // Compute bounding box
            const xs = landmarks.map(p => p.x);
            const ys = landmarks.map(p => p.y);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);

            const boxWidth = (maxX - minX) * videoWidth;
            const boxHeight = (maxY - minY) * videoHeight;
            const centerX = ((minX + maxX) / 2) * videoWidth;
            const centerY = ((minY + maxY) / 2) * videoHeight;

            // Draw on canvas
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, videoWidth, videoHeight);
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.strokeRect(minX * videoWidth, minY * videoHeight, boxWidth, boxHeight);

            // Draw center guide
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(videoWidth * 0.4, videoHeight * 0.4, videoWidth * 0.2, videoHeight * 0.2);

            // Check conditions
            const toleranceX = videoWidth * 0.1;
            const toleranceY = videoHeight * 0.1;
            const isCentered =
              Math.abs(centerX - videoWidth / 2) < toleranceX &&
              Math.abs(centerY - videoHeight / 2) < toleranceY;
            const isVisible = boxHeight > videoHeight * 0.6 && boxHeight < videoHeight * 0.95;

            const valid = isCentered && isVisible;
            setIsValid(valid);

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

  return (
    <div>
      <div
        className="container mt-5 shadow-lg p-4 d-flex flex-column text-center"
        style={{ width: '80%', maxWidth: '500px', backgroundColor: 'white' }}
      >
        <div className="row justify-content-center">
          <img src={reactIcon} alt="React" style={{ width: '64px', height: '64px' }} />
          <h4 className="m-2">Camera Calibration</h4>

          {/* Video + Canvas Overlay */}
          <div style={{ position: 'relative', width: '100%' }}>
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
              width={640}
              height={480}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>

          {/* Feedback */}
          <p style={{ marginTop: '10px', fontWeight: 'bold', color: 'blue' }}>{feedback}</p>
        </div>
      </div>

      {/* Continue Button */}
      <div>
        <button
          onClick={() => nav('/' + fromPage)}
          style={{
            width: '6%',
            maxWidth: '500px',
            backgroundColor: 'rgb(54, 227, 215)',
            bottom: '20px',
            right: '20px',
            position: 'fixed',
            borderColor: 'rgb(54, 227, 215)',
            borderRadius: '5px',
            padding: '10px',
            color: 'white',
            fontWeight: 'bold'
          }}
          disabled={!isValid} // Disable until centered & visible
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default CameraCalibration;

import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import reactIcon from '../assets/react.svg';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

function Game2() {
  const nav = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from;
  const p11Y = useRef(null);
  const p13Y = useRef(null);
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
    <div>
      <div
        className="container mt-5 shadow-lg p-4 d-flex flex-column text-center"
        style={{ width: '95%', maxWidth: '900px', height: '90vh', backgroundColor: 'white' }}
      >
        <div className="row justify-content-center">
          <img src={reactIcon} alt="React" style={{ width: '64px', height: '64px' }} />
          <h4 className="m-2">Camera Calibration</h4>
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
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
          <p style={{ marginTop: '10px', fontWeight: 'bold', color: 'blue' }}>{feedback}</p>
        </div>
      </div>
      <div>
        <button
          onClick={() => {stopCamera(); nav('/' + fromPage)}}
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
          disabled={!isValid.current}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default Game2;

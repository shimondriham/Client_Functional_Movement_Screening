import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

function CameraCalibration() {
  const nav = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [feedback, setFeedback] = useState('Initializing...');
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
        setFeedback('Failed to load camera AI');
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
        setFeedback('Camera access denied');
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

          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;

          ctx.clearRect(0, 0, videoWidth, videoHeight);
          ctx.save();
          ctx.scale(-1, 1);
          ctx.translate(-videoWidth, 0);

          if (!results.landmarks || results.landmarks.length === 0) {
            setFeedback('No person detected');
          } else {
            const landmarks = results.landmarks[0];
            
            // עיצוב נקודות הציון בכתום Fitwave
            ctx.fillStyle = '#F2743E';
            landmarks.forEach(point => {
              const x = point.x * videoWidth;
              const y = point.y * videoHeight;
              ctx.beginPath();
              ctx.arc(x, y, 4, 0, 2 * Math.PI);
              ctx.fill();
            });

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            const connections = [
              [11, 12], [12, 14], [14, 16], [11, 13], [13, 15],
              [12, 24], [11, 23], [23, 24],
              [24, 26], [26, 28], [28, 32], [23, 25], [25, 27], [27, 31]
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

            const xs = landmarks.map(p => p.x);
            const ys = landmarks.map(p => p.y);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);

            const boxHeight = (maxY - minY) * videoHeight;
            const centerX = ((minX + maxX) / 2) * videoWidth;
            const centerY = ((minY + maxY) / 2) * videoHeight;

            const toleranceX = videoWidth * 0.15;
            const toleranceY = videoHeight * 0.15;
            const isCentered =
              Math.abs(centerX - videoWidth / 2) < toleranceX &&
              Math.abs(centerY - videoHeight / 2) < toleranceY;
            const isVisible = boxHeight > videoHeight * 0.5 && boxHeight < videoHeight * 0.95;

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
    return () => { if (animationId) cancelAnimationFrame(animationId); };
  }, []);

  const stopCamera = () => {
    try {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      videoRef.current?.pause();
    } catch (err) { console.warn('Error stopping camera:', err); }
  };

  const styles = {
    wrapper: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#FFFFFF',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      position: 'relative'
    },
    header: { fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px' },
    brandItalic: { fontFamily: 'cursive', fontStyle: 'italic', color: '#F2743E' },
    videoBox: {
      position: 'relative',
      width: '640px',
      maxWidth: '100%',
      aspectRatio: '4/3',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      backgroundColor: '#000',
      marginTop: '20px'
    },
    feedbackOverlay: {
      position: 'absolute',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '8px 20px',
      borderRadius: '20px',
      fontWeight: '700',
      color: feedback === 'Perfect!' ? '#28a745' : '#F2743E',
      zIndex: 10,
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    },
    button: {
      backgroundColor: '#F2743E',
      color: 'white',
      border: 'none',
      borderRadius: '30px',
      padding: '14px 60px',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: isValid.current ? 'pointer' : 'not-allowed',
      opacity: isValid.current ? 1 : 0.6,
      marginTop: '40px',
      boxShadow: '0 4px 15px rgba(242, 116, 62, 0.3)',
      transition: '0.3s'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={{ position: 'absolute', top: '20px', left: '25px', fontWeight: 'bold', fontFamily: 'OOOH Baby, cursive', fontSize: '1.2rem' }}>Fitwave.ai</div>
      
      <h1 style={styles.header}>Camera <span style={styles.brandItalic}>Calibration</span></h1>
      <p style={{ color: '#666' }}>Ensure you are centered for the best vitality tracking.</p>

      <div style={styles.videoBox}>
        <div style={styles.feedbackOverlay}>{feedback}</div>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
        />
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      </div>

      <button
        style={styles.button}
        onClick={() => { if(isValid.current) { stopCamera(); nav('/' + fromPage); } }}
      >
        Continue
      </button>

      <div style={{ marginTop: '40px', fontSize: '0.8rem', color: '#999' }}>
        © Fitwave.ai 2026 | MediaPipe AI Tracking
      </div>
    </div>
  );
}

export default CameraCalibration;
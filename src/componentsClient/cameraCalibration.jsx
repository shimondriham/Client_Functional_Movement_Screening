import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import thisIcon from '../assets/icon.png';

function CameraCalibration() {
  const nav = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from || 'dashboard';

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [feedback, setFeedback] = useState('Initializing...');
  const isValid = useRef(false);
  const poseLandmarkerRef = useRef(null);

  // הוספת הפונט לדף באופן דינמי
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Oooh+Baby&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

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
          video: { width: 1280, height: 720 }
        });
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            processFrames();
          }
        };
      } catch (err) {
        console.error('Camera access error:', err);
        setFeedback('Camera access denied');
      }
    };

    const processFrames = () => {
      const loop = () => {
        if (poseLandmarkerRef.current && videoRef.current && videoRef.current.readyState >= 2) {
          const now = performance.now();
          const results = poseLandmarkerRef.current.detectForVideo(videoRef.current, now);

          if (canvasRef.current && videoRef.current) {
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
              
              ctx.fillStyle = '#F2743E';
              landmarks.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x * videoWidth, point.y * videoHeight, 4, 0, 2 * Math.PI);
                ctx.fill();
              });

              ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
              ctx.lineWidth = 3;
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

              const ys = landmarks.map(p => p.y);
              const minY = Math.min(...ys);
              const maxY = Math.max(...ys);
              const boxHeight = (maxY - minY);
              
              const isCentered = Math.abs(landmarks[0].x - 0.5) < 0.2;
              const isVisible = boxHeight > 0.5;

              if (isCentered && isVisible) {
                isValid.current = true;
                setFeedback('Perfect!');
              } else if (!isCentered) {
                setFeedback('Move to center');
              } else {
                setFeedback('Adjust distance');
              }
            }
          }
        }
        animationId = requestAnimationFrame(loop);
      };
      loop();
    };

    initPoseLandmarker();
    return () => { 
      if (animationId) cancelAnimationFrame(animationId);
      stopCamera(); 
    };
  }, [feedback]);

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const styles = {
    wrapper: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#FFFFFF',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0',
      margin: '0'
    },
    navBar: {
      height: '60px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #eee',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      zIndex: 100
    },
    logoGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    logoText: {
      fontSize: '2.2rem', // הפונט הזה בדרך כלל דורש גודל קצת יותר גדול כדי להיות קריא
      fontFamily: "'Oooh Baby', cursive",
      color: '#111',
      lineHeight: 1
    },
    contentArea: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      width: '100%',
      flex: 1
    },
    header: { fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px', marginTop: '10px' },
    brandItalic: { fontFamily: 'cursive', fontStyle: 'italic', color: '#F2743E' },
    videoBox: {
      position: 'relative',
      width: '900px',
      maxWidth: '95vw',
      aspectRatio: '16/9',
      borderRadius: '32px',
      overflow: 'hidden',
      boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
      backgroundColor: '#000',
      marginTop: '20px'
    },
    feedbackOverlay: {
      position: 'absolute',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '10px 25px',
      borderRadius: '50px',
      fontWeight: '800',
      color: feedback === 'Perfect!' ? '#28a745' : '#F2743E',
      zIndex: 10
    },
    floatingButton: {
      position: 'absolute',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#F2743E',
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      padding: '15px 60px',
      fontSize: '1.2rem',
      fontWeight: '700',
      cursor: 'pointer',
      zIndex: 20,
      transition: 'transform 0.2s'
    }
  };

  return (
    <div style={styles.wrapper}>
      <nav style={styles.navBar}>
        <div style={styles.logoGroup}>
          <img src={thisIcon} alt="Logo" width="28" style={{ opacity: 0.75 }} />
          <span style={styles.logoText}>Fitwave.ai</span>
        </div>
      </nav>

      <div style={styles.contentArea}>
        <h1 style={styles.header}>Camera <span style={styles.brandItalic}>Calibration</span></h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Position yourself so the AI can track your vitality effectively.</p>

        <div style={styles.videoBox}>
          <div style={styles.feedbackOverlay}>{feedback}</div>
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
          />
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />

          {isValid.current && (
            <button
              style={styles.floatingButton}
              onClick={() => { stopCamera(); nav('/' + fromPage); }}
              onMouseEnter={(e) => e.target.style.transform = 'translateX(-50%) scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateX(-50%) scale(1)'}
            >
              Ready to Start
            </button>
          )}
        </div>

        <div style={{ marginTop: 'auto', padding: '20px', color: '#AAA', fontSize: '0.8rem' }}>
          © Fitwave.ai 2026
        </div>
      </div>
    </div>
  );
}

export default CameraCalibration;
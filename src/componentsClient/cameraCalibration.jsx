import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

// ייבוא הלוגו כ-PNG
import Logo from '../assets/logo.png';

function CameraCalibration() {
  const nav = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [feedback, setFeedback] = useState('Initializing...');
  const isValid = useRef(false);
  const poseLandmarkerRef = useRef(null);
  
  // Refs for logic and voice tracking
  const currentFeedbackRef = useRef('Initializing...');
  const lastSpokenFeedbackRef = useRef("");
  const preferredVoiceRef = useRef(null);

  // -------------------------------
  // VOICE INITIALIZATION
  // -------------------------------
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices?.() || [];
      if (!voices.length) return;

      const femaleCandidates = voices.filter(
        (v) =>
          v.lang.startsWith("en") &&
          /female|woman|zira|susan|samantha|eva|sofia|nova|jenny|aria|helena/i.test(v.name) &&
          !/david|mark|george|michael|daniel|james|guy/i.test(v.name)
      );

      preferredVoiceRef.current =
        femaleCandidates[0] || voices.find((v) => v.lang.startsWith("en")) || null;
    };

    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // -------------------------------
  // VOICE FEEDBACK TRIGGER
  // -------------------------------
  useEffect(() => {
    if (!feedback || typeof window === "undefined" || !window.speechSynthesis) return;
    if (feedback === lastSpokenFeedbackRef.current || feedback === 'Initializing...') return;

    lastSpokenFeedbackRef.current = feedback;
    const utterance = new SpeechSynthesisUtterance(feedback);

    if (preferredVoiceRef.current) {
      utterance.voice = preferredVoiceRef.current;
    }

    utterance.lang = "en-US";

    if (feedback === "Perfect!") {
      utterance.rate = 1.3;
      utterance.pitch = 1.4;
      utterance.volume = 1.0;
    } else {
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [feedback]);

  // -------------------------------
  // MAIN AI LOGIC
  // -------------------------------
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
            if (currentFeedbackRef.current !== 'No person detected') {
              currentFeedbackRef.current = 'No person detected';
              setFeedback('No person detected');
            }
          } else {
            const landmarks = results.landmarks[0];
            
            ctx.fillStyle = '#F2743E';
            landmarks.forEach(point => {
              const x = point.x * videoWidth;
              const y = point.y * videoHeight;
              ctx.beginPath();
              ctx.arc(x, y, 4, 0, 2 * Math.PI);
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

            // RESTORED LOGIC: Permanent activation once perfect
            if(!isValid.current) {
              isValid.current = isCentered && isVisible;
            }

            let newFeedback = 'Perfect!';
            if (!isCentered) newFeedback = 'Move to the center';
            else if (!isVisible) newFeedback = 'Adjust distance';

            if (currentFeedbackRef.current !== newFeedback) {
              currentFeedbackRef.current = newFeedback;
              setFeedback(newFeedback);
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
      window.speechSynthesis.cancel();
    };
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
      padding: '20px',
      position: 'relative'
    },
    header: { fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' },
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
      top: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '12px 30px',
      borderRadius: '50px',
      fontWeight: '800',
      fontSize: '1.2rem',
      color: feedback === 'Perfect!' ? '#28a745' : '#F2743E',
      zIndex: 10,
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
    },
    floatingButton: {
      position: 'absolute',
      bottom: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#F2743E',
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      padding: '18px 80px',
      fontSize: '1.3rem',
      fontWeight: '700',
      cursor: isValid.current ? 'pointer' : 'not-allowed',
      opacity: isValid.current ? 1 : 0.6,
      boxShadow: '0 10px 25px rgba(242, 116, 62, 0.4)',
      transition: 'all 0.3s ease',
      zIndex: 20,
      whiteSpace: 'nowrap'
    },
    logoImg: {
        position: 'absolute',
        top: '25px',
        left: '30px',
        width: '120px',
        height: 'auto',
        borderRadius: '12px',
        cursor: 'pointer',
        zIndex: 100
    }
  };

  return (
    <div style={styles.wrapper}>
      <img 
        src={Logo} 
        alt="Fitwave.ai" 
        style={styles.logoImg} 
        onClick={() => nav("/")} 
      />
      
      <h1 style={styles.header}>Camera <span style={styles.brandItalic}>Calibration</span></h1>
      <p style={{ color: '#666', fontSize: '1.1rem' }}>Position yourself so the AI can track your vitality effectively.</p>

      <div style={styles.videoBox}>
        <div style={styles.feedbackOverlay}>{feedback}</div>
        
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
        />
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />

        <button
          style={styles.floatingButton}
          onClick={() => { if(isValid.current) { stopCamera(); nav('/' + fromPage); } }}
          onMouseOver={(e) => isValid.current && (e.target.style.transform = 'translateX(-50%) scale(1.05)')}
          onMouseOut={(e) => e.target.style.transform = 'translateX(-50%) scale(1)'}
        >
          {isValid.current ? 'Ready to Start' : 'Checking Position...'}
        </button>
      </div>

      <div style={{ marginTop: 'auto', padding: '20px', fontSize: '0.9rem', color: '#AAA' }}>
        © Fitwave.ai 2026 | Powered by MediaPipe Vision
      </div>
    </div>
  );
}

export default CameraCalibration;
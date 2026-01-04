// import React from 'react';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import thisIcon from '../assets/icon.png';


function Practice() {
  let nav = useNavigate();
  const videoRef = useRef(null);
  const location = useLocation();
  const fromPage = location.state?.from;
  const [time, setTime] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 } })
      .then(stream => {
        let video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  // אובייקט עיצוב Fitwave Practice
  const styles = {
    wrapper: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#F7F7F7', // רקע אפור בהיר של המותג
      height: '100vh',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden'
    },
    logo: {
      position: 'absolute',
      top: '25px',
      left: '30px',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      zIndex: 10
    },
    mainDisplay: {
      width: '75%',
      height: '75%',
      position: 'absolute',
      top: '50%',
      right: '50px',
      transform: 'translateY(-50%)',
      backgroundColor: '#1A1A1A', // שחור פחם של המותג
      borderRadius: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      overflow: 'hidden'
    },
    timerText: {
      color: '#FFFFFF',
      fontSize: '24px',
      fontWeight: '600',
      position: 'absolute',
      top: '30px',
      left: '40px',
      letterSpacing: '1px'
    },
    playButton: {
      padding: '18px 45px',
      fontSize: '1.2rem',
      borderRadius: '40px',
      border: 'none',
      backgroundColor: '#F2743E', // הכתום של Fitwave
      color: 'white',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 8px 20px rgba(242, 116, 62, 0.4)',
      transition: 'transform 0.2s ease'
    },
    cameraPreview: {
      width: '18%',
      aspectRatio: '16/9',
      position: 'absolute',
      bottom: '50px',
      left: '50px',
      borderRadius: '16px',
      backgroundColor: '#000',
      objectFit: 'cover',
      border: '4px solid #FFFFFF',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
    },
    footer: {
      position: 'absolute',
      bottom: '20px',
      right: '50px',
      fontSize: '0.8rem',
      color: '#999'
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* לוגו המותג */}
      <div style={styles.logo}>🏆 Fitwave.ai</div>

      {/* אזור התצוגה המרכזי (איפה שהמשחק/תרגול ירוץ) */}
      <div style={styles.mainDisplay}>
        <div style={styles.timerText}>
          TIME LEFT: <span style={{ color: '#F2743E' }}>{time}s</span>
        </div>
        
        {showButton && (
          <button 
            onClick={() => { setShowButton(false); setIsRunning(true); }} 
            style={styles.playButton}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            START PRACTICE
          </button>
        )}

        {!showButton && time > 0 && (
           <h2 style={{color: 'white', fontSize: '3rem'}}>Ready?</h2>
        )}

        {time === 0 && (
           <h2 style={{color: '#F2743E', fontSize: '3rem'}}>Goal Reached!</h2>
        )}
      </div>

      {/* תצוגה מקדימה של המצלמה (המשתמש) */}
      <video 
        ref={videoRef} 
        style={styles.cameraPreview} 
        muted 
        playsInline
      />

      
    </div>
  );
}

export default Practice;
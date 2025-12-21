import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';

function Instructions() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from;

  const handleContinue = () => {    
    navigate('/cameraCalibration', { state: { from: fromPage } });
  };

  // אובייקט עיצוב Fitwave Instructions
  const styles = {
    wrapper: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#FFFFFF',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px',
      position: 'relative'
    },
    logo: {
      position: 'absolute',
      top: '20px',
      left: '25px',
      fontWeight: 'bold',
      fontSize: '1.2rem'
    },
    header: {
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '10px',
      color: '#1A1A1A'
    },
    brandItalic: {
      fontFamily: 'cursive',
      fontStyle: 'italic',
      fontWeight: '400',
      color: '#F2743E'
    },
    videoContainer: {
      width: '100%',
      maxWidth: '800px',
      aspectRatio: '16/9',
      backgroundColor: '#F7F7F7',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
      margin: '40px 0'
    },
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    button: {
      backgroundColor: '#F2743E',
      color: 'white',
      border: 'none',
      borderRadius: '30px',
      padding: '14px 50px',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(242, 116, 62, 0.3)',
      transition: 'transform 0.2s ease'
    },
    footer: {
      position: 'fixed',
      bottom: '20px',
      fontSize: '0.8rem',
      color: '#999'
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* לוגו המותג */}
      <div style={styles.logo}>🏆 Fitwave.ai</div>

      <h1 style={styles.header}>
        General <span style={styles.brandItalic}>Instructions</span>
      </h1>
      <p style={{ color: '#666', textAlign: 'center', maxWidth: '500px' }}>
        Watch the video carefully to ensure your training session is effective and safe.
      </p>

      {/* Video Display */}
      <div style={styles.videoContainer}>
        <video
          controls
          style={styles.video}
          poster="src/assets/video-placeholder.png" // אופציונלי: תמונת פוסטר מעוצבת
        >
          <source src="src/assets/videoplayback.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <button
        type="button"
        style={styles.button}
        onClick={handleContinue}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        Continue
      </button>

      
    </div>
  );
}

export default Instructions;
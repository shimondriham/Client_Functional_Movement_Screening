import React from 'react';
import { useNavigate } from 'react-router-dom';
import thisIcon from '../assets/icon.png';


function Page404() {
  const navigate = useNavigate();

  const styles = {
    wrapper: {
      fontFamily: "'ooh baby', cursive, sans-serif",
      backgroundColor: '#FFFFFF',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px',
      position: 'relative'
    },
    logo: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      fontWeight: 'bold',
      fontSize: '1.2rem'
    },
    errorCode: {
      fontSize: '10rem',
      fontWeight: '900',
      lineHeight: '1',
      color: '#F7F7F7', // אפור בהיר מאוד כרקע למספר
      position: 'absolute',
      zIndex: 0
    },
    content: {
      zIndex: 1,
      position: 'relative'
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
    subHeader: {
      color: '#666',
      fontSize: '1.1rem',
      marginBottom: '30px',
      maxWidth: '400px'
    },
    button: {
      backgroundColor: '#F2743E',
      color: 'white',
      border: 'none',
      borderRadius: '30px',
      padding: '14px 40px',
      fontSize: '1rem',
      fontWeight: '600',
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
      <div style={styles.logo}>Fitwave.ai</div>

      {/* מספר השגיאה ברקע */}
      <div style={styles.errorCode}>404</div>

      <div style={styles.content}>
        <h1 style={styles.header}>
          Page <span style={styles.brandItalic}>Not Found</span>
        </h1>
        <p style={styles.subHeader}>
          Oops! It looks like you've wandered off the training path. Let's get you back to your vitality journey.
        </p>
        
        <button 
          style={styles.button}
          onClick={() => navigate('/')}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Back to welcome page
        </button>
      </div>

      <div style={styles.footer}>
        © Fitwave.ai 2026 | Support: support@fitwave.ai
      </div>
    </div>
  );
}

export default Page404;
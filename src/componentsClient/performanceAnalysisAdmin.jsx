import { useNavigate } from 'react-router-dom';
import React from 'react';

function PerformanceAnalysis() {
  const navigate = useNavigate();
  const score = 80; // placeholder value

  const goHome = () => navigate('/dashboard');
  const onDownload = () => {
    window.print();
  };

  // אובייקט עיצוב Fitwave Analysis
  const styles = {
    wrapper: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#F7F7F7',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '24px'
    },
    card: {
      backgroundColor: '#FFFFFF',
      maxWidth: '900px',
      width: '100%',
      margin: '0 auto',
      borderRadius: '32px',
      padding: '60px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      position: 'relative',
      textAlign: 'center'
    },
    logo: {
      fontFamily: "'OOh Baby', cursive, sans-serif",
      position: 'absolute',
      top: '30px',
      left: '40px',
      fontWeight: 'bold',
      fontSize: '1.2rem'
    },
    homeBtn: {
      position: 'absolute',
      top: '30px',
      right: '40px',
      border: 'none',
      background: '#F7F7F7',
      borderRadius: '50%',
      width: '45px',
      height: '45px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: '0.3s'
    },
    title: {
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
    scoreCircle: {
      width: '180px',
      height: '180px',
      borderRadius: '50%',
      border: '8px solid #F2743E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '3.5rem',
      fontWeight: '800',
      color: '#1A1A1A',
      margin: '40px auto'
    },
    downloadBtn: {
      backgroundColor: '#F2743E',
      color: 'white',
      border: 'none',
      padding: '14px 35px',
      borderRadius: '30px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '30px',
      boxShadow: '0 4px 15px rgba(242, 116, 62, 0.3)'
    },
    footerLine: {
      marginTop: '40px',
      color: '#999',
      fontSize: '0.85rem'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>Fitwave.ai</div>

        {/* Home Button */}
        <button onClick={goHome} style={styles.homeBtn} title="Back to Dashboard">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F2743E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>

        <h1 style={styles.title}>
          Performance <span style={styles.brandItalic}>Analysis</span>
        </h1>
        <p style={{ color: '#666' }}>Great job! Here is how you performed in your last session.</p>

        {/* Visual Score */}
        <div style={styles.scoreCircle}>
          {score}<span style={{fontSize: '1.5rem', marginTop: '10px'}}>%</span>
        </div>

        <div className="mx-auto" style={{ maxWidth: '600px' }}>
          <h3 style={{fontWeight: '700', marginBottom: '15px'}}>Vitality Insights</h3>
          <p style={{ color: '#777', lineHeight: '1.8', fontSize: '1.05rem' }}>
            Your accuracy and consistency are improving! Keep maintaining this pace to reach your weekly goals. 
            Phasellus urna justo, porta id semper eget, iaculis nec leo. Interdum et malesuada fames ac ante
            ipsum primis in faucibus.
          </p>
        </div>

        <button style={styles.downloadBtn} onClick={onDownload}>
          Download Report (PDF)
        </button>

        
      </div>
    </div>
  );
}

export default PerformanceAnalysis;
// import React, { useState } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f8f8f8'
  },
  videoBox: {
    width: 480,
    height: 270,
    background: '#ccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: '24px 0'
  },
  playIcon: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: '#eee',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 36
  },
  instructions: {
    fontWeight: 'bold',
    fontSize: 24,
    margin: '16px 0 8px 0'
  }
};

function Instructions () {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const location = useLocation();
  const fromPage = location.state?.from;

  const handleContinue = () => {
    navigate('/cameraCalibration',{state:fromPage});
  };

  
  return (
    <div style={styles.container}>
      <div style={{ fontSize: 22, marginBottom: 18 }}>Logo</div>
      <div style={styles.instructions}>General Instructions</div>
      <div style={styles.videoBox}>
        <div style={styles.playIcon}>&#9654;</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
          style={{ width: 24, height: 24, marginRight: 7 }}
        />
        <span>Confirm instructions</span>
      </div>
      <button
        style={{
          marginLeft: 700,
          marginTop: 24,
          padding: '10px 30px',
          border: '1px solid #bbb',
          borderRadius: 6,
          background: checked ? 'white' : '#eee',
          fontSize: 18,
          color: checked ? 'black' : '#999',
          cursor: checked ? 'pointer' : 'not-allowed'
        }}
        onClick={handleContinue}
        disabled={!checked}
        
      >
        Continue
      </button>
    </div>
  );
}

export default Instructions;

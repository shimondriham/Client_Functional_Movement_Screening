// import React from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f8f8f8'
  },
  logo: {
    fontSize: 24,
    textAlign: 'center',
    margin: '32px 0 40px 0'
  },
  circlesRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    margin: '40px 0'
  },
  circleButton: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: '#d6d6d6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 23,
    border: 'none',
    cursor: 'pointer'
  },
  resultBtn: {
    position: 'absolute',
    bottom: 50,
    right: 80,
    padding: '18px 40px',
    fontSize: 22,
    borderRadius: 8,
    background: 'white',
    border: '3px solid #cfcfcf',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  homeIcon: {
    position: 'absolute',
    left: 70,
    top: 40
  }
};

function Dashboard() {
  const navigate = useNavigate();

  const handleResult = () => {
    navigate('/PerformanceAnalysis');
  };

  const handleGame = () => {
    navigate('/gameList');
  };

  const handlePhysio = () => {
    navigate('/practiceList');
  }

  return (
    <div style={styles.container}>
      {/* Home Icon placeholder */}
      <div style={styles.homeIcon}>
        <div style={{
          width: 46,
          height: 60,
          background: '#ebebeb',
          borderRadius: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}>
          <div style={{
            width: 28,
            height: 28,
            background: '#cfcfcf',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            marginTop: 0
          }}></div>
          <div style={{
            width: 28,
            height: 26,
            background: '#d6d6d6',
            marginTop: -6
          }}></div>
        </div>
      </div>
      <div style={styles.logo}>Logo</div>
      <div style={styles.circlesRow}>
        <button style={styles.circleButton} onClick={handlePhysio} > Physio</button>
        <button style={styles.circleButton}>Strength</button>
        <button style={styles.circleButton}>Flexibility</button>
        <button style={styles.circleButton}>Cardio</button>
        <button style={styles.circleButton}>Relax</button>
        <button style={styles.circleButton} onClick={handleGame}>Game</button>
      </div>
      <button style={styles.resultBtn} onClick={handleResult}>Result</button>
    </div>
  );
}

export default Dashboard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f8f8f8',
    position: 'relative'
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
  },
  popupOverlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  popup: {
    background: 'white',
    padding: '48px 60px 34px 60px',
    borderRadius: 10,
    minWidth: 800,
    minHeight: 550,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    position: 'relative'
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 24
  },
  filterBtn: {
    border: '4px solid #cfcfcf',
    background: 'white',
    borderRadius: 4,
    width: 110,
    height: 60,
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 8,
    cursor: 'pointer'
  },
  resumeBtn: {
    position: 'absolute',
    right: 24,
    bottom: 18,
    border: '4px solid #cfcfcf',
    background: 'white',
    fontSize: 21,
    borderRadius: 4,
    padding: '8px 28px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

const filterLabels = [
  {label: "Time"},
  {label: "Level"},
  {label: "Type"}
];

function Popup({ onClose }) {
  return (
    <div style={styles.popupOverlay} onClick={onClose}>
      <div style={styles.popup} onClick={e => e.stopPropagation()}>
        {filterLabels.map(({label}, idx) => (
          <div style={styles.filterRow} key={idx}>
            <button style={styles.filterBtn}>{label}</button>
            <span style={{ fontSize: 20 }}>Drop down with options</span>
          </div>
        ))}
        <button style={styles.resumeBtn}>Resume</button>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [popupOpen, setPopupOpen] = useState(false);

  const handleResult = () => {
    navigate('/PerformanceAnalysis');
  };

  const handleCircleClick = () => {
    setPopupOpen(true);
  };

  return (
    <div style={styles.container}>
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
        <button style={styles.circleButton} onClick={handleCircleClick}>Physio</button>
        <button style={styles.circleButton} onClick={handleCircleClick}>Strength</button>
        <button style={styles.circleButton} onClick={handleCircleClick}>Flexibility</button>
        <button style={styles.circleButton} onClick={handleCircleClick}>Cardio</button>
        <button style={styles.circleButton} onClick={handleCircleClick}>Relax</button>
        <button style={styles.circleButton} onClick={handleCircleClick}>Play</button>
      </div>
      <button style={styles.resultBtn} onClick={handleResult}>Result</button>
      {popupOpen && <Popup onClose={() => setPopupOpen(false)} />}
    </div>
  );
}

export default Dashboard;

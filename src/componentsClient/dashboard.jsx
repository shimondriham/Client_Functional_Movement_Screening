import React from 'react';
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
    cursor: 'pointer',
    position: 'relative'
  },
  lockedButton: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  arrow: {
    alignSelf: 'center',
    fontSize: 28
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
  lockIcon: {
    position: 'absolute',
    right: 18,
    top: 18,
    fontSize: 24
  }
};

const games = [
  { id: 1, name: 'Game1', locked: false },
  { id: 2, name: 'Game2', locked: true },
  { id: 3, name: 'Game3', locked: true },
  { id: 4, name: 'Game4', locked: true },
  { id: 5, name: 'Game5', locked: true },
  { id: 6, name: 'Game6', locked: true },
];

function Dashboard() {
  const navigate = useNavigate();

  const handleGameClick = (game) => {
    if (!game.locked) {
      navigate('/instructions');
    } else {
      alert('You must complete Game 1 first');
    }
  };

  const handleResultClick = () => {
    navigate('/performanceAnalysis');
  };


  return (
    <div style={styles.container}>
      <div style={styles.logo}>Logo</div>
      <div style={styles.circlesRow}>
        {games.map((game, idx) => (
          <React.Fragment key={game.id}>
            <button
              style={{
                ...styles.circleButton,
                ...(game.locked ? styles.lockedButton : {})
              }}
              onClick={() => handleGameClick(game)}
            >
              {game.name}
              {game.locked && <span style={styles.lockIcon}></span>}
            </button>
            {idx < games.length - 1 && (
              <span style={styles.arrow}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <button style={styles.resultBtn} onClick={handleResultClick}>Result</button>
    </div>
  );
}

export default Dashboard;

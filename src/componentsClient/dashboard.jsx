import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ background: '#f8f8f8' }}>
      {/* Logo */}
      <div className="text-center my-4" style={{ fontSize: 24 }}>
        Logo
      </div>

      {/* Circles row */}
      <div className="d-flex justify-content-center align-items-center my-4 gap-4">
        {games.map((game, idx) => (
          <React.Fragment key={game.id}>
            <button
              type="button"
              className="btn d-flex justify-content-center align-items-center position-relative"
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: '#d6d6d6',
                fontSize: 23,
                border: 'none',
                cursor: game.locked ? 'not-allowed' : 'pointer',
                opacity: game.locked ? 0.6 : 1,
              }}
              onClick={() => handleGameClick(game)}
            >
              {game.name}
              {game.locked && (
                <span
                  className="position-absolute"
                  style={{ right: 18, top: 18, fontSize: 24 }}
                >
                  🔒
                </span>
              )}
            </button>

            {idx < games.length - 1 && (
              <span style={{ fontSize: 28 }}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Result button fixed bottom-right */}
      <button
        type="button"
        onClick={handleResultClick}
        className="btn fw-bold position-fixed"
        style={{
          bottom: 50,
          right: 80,
          padding: '18px 40px',
          fontSize: 22,
          borderRadius: 8,
          background: 'white',
          border: '3px solid #cfcfcf',
          cursor: 'pointer',
        }}
      >
        Result
      </button>
    </div>
  );
}

export default Dashboard;

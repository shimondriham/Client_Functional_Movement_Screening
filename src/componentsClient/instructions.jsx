import { useNavigate, useLocation } from 'react-router-dom';

function Instructions() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from;

  const handleContinue = () => {    
    navigate('/cameraCalibration', { state:  { from: fromPage }  });
  };

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center" style={{ background: '#f8f8f8' }}>
      <div className="fw-bold" style={{ fontSize: 24, margin: '16px 0 8px 0' }}>
        General Instructions
      </div>

      <div
        className="overflow-hidden my-3"
        style={{ width: 640, height: 360, borderRadius: 8 }}
      >
        <video
          width="640"
          height="360"
          controls
          className="w-100 h-100"
          style={{ borderRadius: 8 }}
        >
          <source src="src/assets/videoplayback.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <button
        type="button"
        className="btn mt-3"
        style={{
          padding: '10px 30px',
          border: '1px solid #bbb',
          borderRadius: 6,
          background: 'white',
          fontSize: 18,
          color: 'black',
          cursor: 'pointer',
        }}
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
}

export default Instructions;
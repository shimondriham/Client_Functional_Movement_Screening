import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Instructions() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const location = useLocation();
  const fromPage = location.state?.from;

  const handleContinue = () => {
    navigate('/cameraCalibration', { state: fromPage });
  };

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center" style={{ background: '#f8f8f8' }}>
      {/* כותרת */}
      <div className="fw-bold" style={{ fontSize: 24, margin: '16px 0 8px 0' }}>
        General Instructions
      </div>

      {/* וידאו – קופסה 480x270 (16:9) */}
      <div
        className="overflow-hidden my-3"
        style={{ width: 480, height: 270, borderRadius: 8 }}
      >
        <video
          width="480"
          height="270"
          controls
          className="w-100 h-100"
          style={{ borderRadius: 8 }}
        >
          <source src="src/assets/videoplayback.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* צ'קבוקס + טקסט בשורה */}
      <div className="d-flex align-items-center">
        <input
          className="form-check-input me-2"
          type="checkbox"
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
          style={{ width: 24, height: 24 }}
          id="confirmInstructions"
        />
        <label htmlFor="confirmInstructions" className="form-check-label">
          Confirm instructions
        </label>
      </div>

      {/* כפתור Continue – נשאר מימין אבל תוך שימוש ב-margin Bootstrap */}
      <button
        type="button"
        className="btn mt-3"
        style={{
          marginLeft: 700,
          padding: '10px 30px',
          border: '1px solid #bbb',
          borderRadius: 6,
          background: checked ? 'white' : '#eee',
          fontSize: 18,
          color: checked ? 'black' : '#999',
          cursor: checked ? 'pointer' : 'not-allowed',
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

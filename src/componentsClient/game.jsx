import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reactIcon from '../assets/react.svg'; // אם לא בשימוש, אפשר להסיר

function Game() {
  const nav = useNavigate();
  const videoRef = useRef(null);
  const [showButton, setShowButton] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 } })
      .then((stream) => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  return (
    <div className="position-relative">
      {/* וידאו כרקע במסך מלא, בלי אפקט מראה */}
      <video
        ref={videoRef}
        className="position-fixed top-0 start-0"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      />

      {/* כפתור Play ממורכז עם Bootstrap */}
      {showButton && (
        <button
          type="button"
          className="btn fw-bold text-white position-absolute top-50 start-50 translate-middle"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#36e3d7',
          }}
          onClick={() => {
            setShowButton(false);
            setIsRunning(true);
          }}
        >
          Play
        </button>
      )}
    </div>
  );
}

export default Game;

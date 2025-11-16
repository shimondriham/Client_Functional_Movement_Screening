// import React from 'react';
import { useNavigate } from 'react-router-dom';
import reactIcon from '../assets/react.svg';
import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';




function Practice() {
  let nav = useNavigate();
  const videoRef = useRef(null);
  const location = useLocation();
  const fromPage = location.state?.from
  const [time, setTime] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [showButton, setShowButton] = useState(true);


  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {width: 1280, height: 720} })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
    })
    .catch(err => {
      console.error(err);
    })
  }

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  return (
    <div>
          <img src={reactIcon} alt="React" style={{ width: '64px', height: '64px' }} />
          <div style={{ width: '70%', height: '70%', position: 'absolute', top: '50px', right: '50px', backgroundColor: '#2c2a2aff', border: '2px solid #ccc', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }} >
            <div>
              <p style={{ color: 'white', fontSize: '18px' }}>Time left: {time} seconds</p>
              {showButton && (
                <button onClick={() => { setShowButton(false); setIsRunning(true); }} style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '5px', border: 'none', backgroundColor: '#36e3d7',
                                                                  color: 'white', fontWeight: 'bold', top: '50%', left: '50%', position: 'absolute', transform: 'translate(-50%, -50%)'}}>Play</button>
              )}
            </div>
          </div>
          <video ref={videoRef} style={{ width: '20%', height: 'auto', position: 'absolute', bottom: '50px', left: '50px', objectFit: 'cover' }} >
          </video>
    </div>
    
  );
};


export default Practice;
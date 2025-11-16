// import React from 'react';
import { useNavigate } from 'react-router-dom';
import reactIcon from '../assets/react.svg';
import React, { useRef, useEffect, useState } from 'react';


function Game() {
  let nav = useNavigate();
  const videoRef = useRef(null);
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

  return (
    <div>
      <video ref={videoRef} style={{width: '100%', height: '100%', objectFit: 'cover', position: 'fixed', top: 0, left: 0, zIndex: -1}} >
      </video>
      {showButton && (
        <button onClick={() => { setShowButton(false); setIsRunning(true); }} style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '5px', border: 'none', backgroundColor: '#36e3d7',
                                                                  color: 'white', fontWeight: 'bold', top: '50%', left: '50%', position: 'absolute', transform: 'translate(-50%, -50%)'}}>Play</button>
          )}
    </div>
  );
};

export default Game;
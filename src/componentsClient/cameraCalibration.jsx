// import React from 'react';
import { useNavigate } from 'react-router-dom';
import reactIcon from '../assets/react.svg';
import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';


function CameraCalibration() {
  let nav = useNavigate();
  const videoRef = useRef(null);
  const location = useLocation();
  const fromPage = location.state?.from


  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {width: 1920, height: 1080} })
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
    // מונע גלילה
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      // מחזיר גלילה כשיוצאים מהקומפוננטה
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [videoRef]);


  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      padding: '10px',
      boxSizing: 'border-box'
    }}>
      <div className="container shadow-lg p-4 d-flex flex-column text-center" style={{ 
        width: '100%', 
        maxWidth: '800px', 
        backgroundColor: 'white',
        maxHeight: '95vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="row justify-content-center" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h4 className='m-2'>Camera Calibration</h4>
          <video 
            ref={videoRef} 
            autoPlay 
            style={{ 
              width: '100%', 
              flex: 1,
              maxHeight: 'calc(95vh - 100px)',
              border: '1px solid #ccc', 
              borderRadius: '8px',
              objectFit: 'cover',
              transform: 'scaleX(-1)',
              WebkitTransform: 'scaleX(-1)'
            }} 
          />
        </div>
      </div>
      <div>
        <button 
          onClick={() => nav("/" + fromPage)} 
          style={{ 
            width: '6%', 
            maxWidth: '500px', 
            backgroundColor: 'rgb(54, 227, 215)', 
            bottom: '20px', 
            right: '20px', 
            position: 'fixed', 
            borderColor: 'rgb(54, 227, 215)', 
            borderRadius: '5px', 
            padding: '10px', 
            color: 'white', 
            fontWeight: 'bold'
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}


export default CameraCalibration;

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
      <div className=" container mt-5 shadow-lg p-4 d-flex flex-column text-center" style={{ width: '80%', maxWidth: '500px', backgroundColor: 'white' }}>
        <div className="row justify-content-center">
          <img src={reactIcon} alt="React" style={{ width: '64px', height: '64px' }} />
          <h4 className='m-2'>Camera Calibration</h4>
          <video ref={videoRef} autoPlay style={{ width: '100%', border: '1px solid #ccc', borderRadius: '8px' }} >
          </video>
        </div>
      </div>
      <div>
        <button onClick={() => nav("/" + fromPage) } style={{ width: '6%', maxWidth: '500px', backgroundColor: 'rgb(54, 227, 215)', bottom: '20px', right: '20px', position: 'fixed', borderColor: 'rgb(54, 227, 215)', borderRadius: '5px', padding: '10px', color: 'white', fontWeight: 'bold'}}>
          Continue
        </button>
      </div>
    </div>
    
  );
};


export default CameraCalibration;
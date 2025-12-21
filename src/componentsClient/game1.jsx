import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import reactIcon from '../assets/react.svg';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

function Game1() {
  const nav = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from;

  const videoRef = useRef(null);     // live camera
  const canvasRef = useRef(null);    // pose overlay
  const poseLandmarkerRef = useRef(null);

  const p11Y = useRef(null);
  const p13Y = useRef(null);
  const isValid = useRef(false);

  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let animationId;

    const initPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
        },
        runningMode: 'VIDEO',
        numPoses: 1
      });

      startCamera();
    };

    const startCamera = async () => {
      if (!videoRef.current) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });

      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        processFrames();
      };
    };

    const processFrames = () => {
      const loop = () => {
        if (poseLandmarkerRef.current && videoRef.current) {
          const now = performance.now();
          const results = poseLandmarkerRef.current.detectForVideo(videoRef.current, now);

          const vw = videoRef.current.videoWidth;
          const vh = videoRef.current.videoHeight;

          canvasRef.current.width = vw;
          canvasRef.current.height = vh;

          if (!results.landmarks?.length) {
            setFeedback('No person detected');
          } else {
            const landmarks = results.landmarks[0];

            if (landmarks[11] && landmarks[12]) {
              p11Y.current = landmarks[11].y;
              p13Y.current = landmarks[12].y;

              const pixel11Y = p11Y.current * vh;
              const pixel12Y = p13Y.current * vh;

              const isAboveShoulder =
                pixel11Y >= vh * 0.3 && pixel12Y >= vh * 0.3;

              if (!isValid.current) {
                isValid.current = isAboveShoulder;
              }

              setFeedback(
                isAboveShoulder ? 'Perfect!' : 'Raise your left hand higher'
              );
            }
          }
        }

        animationId = requestAnimationFrame(loop);
      };

      loop();
    };

    initPoseLandmarker();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
  };

return (
  <div
    style={{
      width: '100%',
      height: 'calc(100vh - 60px)', // navbar height
      overflow: 'hidden',
      background: 'black'
    }}
  >
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      {/* Background MP4 */}
      <video
        src="src/assets/videoplayback.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      {/* Live Camera */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scaleX(-1)',
          opacity: 0.85
        }}
      />

      {/* Pose Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Feedback */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'deepskyblue',
          fontWeight: 'bold',
          fontSize: 22
        }}
      >
        {feedback}
      </div>
    </div>
  </div>
);

}

export default Game1;

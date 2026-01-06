import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ייבוא הלוגו כ-PNG
import Logo from '../assets/logo.png';

function Instructions() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from;

  const handleContinue = () => {
    navigate("/cameraCalibration", { state: { from: fromPage } });
  };

  const styles = {
    wrapper: {
      fontFamily: "'Inter', sans-serif", // פונט נקי לשאר הטקסט
      backgroundColor: "#FFFFFF",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box",
    },
    logoContainer: {
      position: "absolute",
      top: "30px",
      left: "30px",
      cursor: "pointer",
      zIndex: 10,
    },
    logoImg: {
      width: "130px", // גודל אחיד לכל המערכת
      height: "auto",
      borderRadius: "12px", // השפה העיצובית שלך
    },
    header: {
      fontSize: "2.8rem",
      fontWeight: "800",
      margin: "30px 0 10px 0",
      color: "#1A1A1A",
      textAlign: "center",
    },
    brandItalic: {
      fontFamily: "'OOOH Baby', cursive",
      fontStyle: "italic",
      fontWeight: "400",
      color: "#F2743E",
    },
    description: {
      color: "#666",
      textAlign: "center",
      maxWidth: "500px",
      margin: "0 0 24px 0",
      lineHeight: 1.6,
      fontSize: "1.05rem",
    },
    videoContainer: {
      width: "100%",
      maxWidth: "750px",
      aspectRatio: "16/9",
      backgroundColor: "#F7F7F7",
      borderRadius: "24px",
      overflow: "hidden",
      // boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      margin: "16px 0 32px 0",
      flexShrink: 0,
      border: "1px solid #F0F0F0",
    },
    video: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
    button: {
      backgroundColor: "#F2743E",
      color: "white",
      border: "none",
      borderRadius: "30px",
      padding: "16px 60px",
      fontSize: "1.1rem",
      fontWeight: "700",
      cursor: "pointer",
      boxShadow: "0 6px 20px rgba(242, 116, 62, 0.3)",
      transition: "all 0.3s ease",
      flexShrink: 0,
    },
  };

  return (
    <div style={styles.wrapper}>
      {/* לוגו PNG בפינה השמאלית העליונה */}
      <div style={styles.logoContainer} onClick={() => navigate("/")}>
        <img src={Logo} alt="Fitwave.ai" style={styles.logoImg} />
      </div>

      <h1 style={styles.header}>
        General <span style={styles.brandItalic}>Instructions</span>
      </h1>

      <p style={styles.description}>
        Watch the video carefully to ensure your training session is effective
        and safe. Proper form is the key to recovery.
      </p>

      {/* תצוגת וידאו */}
      <div style={styles.videoContainer}>
        <video
          controls
          style={styles.video}
          poster="/src/assets/video-placeholder.png"
        >
          <source src="/src/assets/videoplayback.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <button
        type="button"
        style={styles.button}
        onClick={handleContinue}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.backgroundColor = "#E6632D";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = "#F2743E";
        }}
      >
        Continue to Calibration
      </button>
    </div>
  );
}

export default Instructions;
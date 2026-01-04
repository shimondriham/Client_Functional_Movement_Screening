import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Instructions() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from;

  const handleContinue = () => {
    navigate("/cameraCalibration", { state: { from: fromPage } });
  };

  const styles = {
    wrapper: {
      fontFamily: "'OOh Baby', cursive, sans-serif",
      backgroundColor: "#FFFFFF",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box",
    },
    logo: {
      position: "absolute",
      top: "20px",
      left: "25px",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
    header: {
      fontSize: "2.5rem",
      fontWeight: "800",
      margin: "30px 0 10px 0",
      color: "#1A1A1A",
      textAlign: "center",
    },
    brandItalic: {
      fontFamily: "cursive",
      fontStyle: "italic",
      fontWeight: "400",
      color: "#F2743E",
    },
    description: {
      color: "#666",
      textAlign: "center",
      maxWidth: "500px",
      margin: "0 0 16px 0",
      lineHeight: 1.4,
    },
    videoContainer: {
      width: "100%",
      maxWidth: "800px",
      aspectRatio: "16/9",
      backgroundColor: "#F7F7F7",
      borderRadius: "24px",
      overflow: "hidden",
      boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
      margin: "16px 0 22px 0",
      flexShrink: 0,
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
      padding: "14px 50px",
      fontSize: "1.1rem",
      fontWeight: "700",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(242, 116, 62, 0.3)",
      transition: "transform 0.2s ease",
      flexShrink: 0,
    },
  };

  const handleMouseOver = (e) => {
    e.currentTarget.style.transform = "scale(1.05)";
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.transform = "scale(1)";
  };

  return (
    <div style={styles.wrapper}>
      {/* Brand logo */}
      <div style={styles.logo}>Fitwave.ai</div>
      <h1 style={styles.header}>
        General <span style={styles.brandItalic}>Instructions</span>
      </h1>

      <p style={styles.description}>
        Watch the video carefully to ensure your training session is effective
        and safe.
      </p>

      {/* Video Display */}
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
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        Continue
      </button>
    </div>
  );
}

export default Instructions;

import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { doApiGet } from "../services/apiService";

function PerformanceAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedGameData = location.state?.gameData;
  const passedGameId = location.state?.gameId;
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let score = 0; 

  useEffect(() => {
    fetchGameData();
  }, []);
  // Ensure we start at the top of the page when this route mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchGameData = async () => {
    try {
      setLoading(true);
      // If the page was navigated with specific game data, use it
      if (passedGameData) {
        console.log("Using passed game data:", passedGameData);
        const item = Array.isArray(passedGameData)
          ? passedGameData[passedGameData.length - 1]
          : passedGameData;
        setGames(item ? [item] : []);
      } else if (passedGameId) {
        // Fetch only the specified game
        const data = await doApiGet(`/currentGame/${passedGameId}`);
        console.log("Fetched currentGame:", data.data);
        setGames(data.data ? [data.data] : []);
      } else {
        const data = await doApiGet("/games/allUsergames");
        console.log("Games data:", data.data);
        const arr = Array.isArray(data.data) ? data.data : [];
        const latest = arr.length ? arr[arr.length - 1] : null;
        setGames(latest ? [latest] : []);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to load game data");
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => navigate("/dashboard");

  const onDownload = () => {
    window.print();
  };

  const styles = {
    wrapper: {
      fontFamily: "'OOh Baby', cursive, sans-serif",
      backgroundColor: "#F7F7F7",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      boxSizing: "border-box",
    },
    card: {
      backgroundColor: "#FFFFFF",
      maxWidth: "900px",
      width: "100%",
      borderRadius: "32px",
      padding: "40px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      position: "relative",
      textAlign: "center",
      maxHeight: "calc(100vh - 48px)",
      overflowY: "auto",
    },
    logo: {
      position: "absolute",
      top: "30px",
      left: "40px",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
    homeBtn: {
      position: "absolute",
      top: "30px",
      right: "40px",
      border: "none",
      background: "#F7F7F7",
      borderRadius: "50%",
      width: "45px",
      height: "45px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "0.3s",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "800",
      marginBottom: "10px",
      color: "#1A1A1A",
    },
    brandItalic: {
      fontFamily: "cursive",
      fontStyle: "italic",
      fontWeight: "400",
      color: "#F2743E", // הכתום של המותג
    },
    scoreDisplay: {
      width: "180px",
      height: "180px",
      borderRadius: "50%",
      border: "8px solid #F2743E",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      margin: "40px auto",
    },
    scoreNumber: {
      fontSize: "3.5rem",
      fontWeight: "800",
      color: "#1A1A1A",
      lineHeight: "1",
    },
    scoreText: {
      fontSize: "1rem",
      color: "#F2743E",
      fontWeight: "700",
      textTransform: "uppercase",
    },
    downloadBtn: {
      backgroundColor: "#F2743E",
      color: "white",
      border: "none",
      padding: "14px 35px",
      borderRadius: "30px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "30px",
      boxShadow: "0 4px 15px rgba(242, 116, 62, 0.3)",
      transition: "0.3s",
    },
    footerLine: {
      marginTop: "40px",
      color: "#999",
      fontSize: "0.85rem",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>Fitwave.ai</div>

        {/* Home Button */}
        <button
          onClick={goHome}
          style={styles.homeBtn}
          title="Back to Dashboard"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F2743E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>

        <h1 style={styles.title}>
          Performance <span style={styles.brandItalic}>Analysis</span>
        </h1>
        <p style={{ color: "#666", fontSize: "1.1rem" }}></p>

        {/* Visual Score Circle */}
        <div style={styles.scoreDisplay}>
          <div style={styles.scoreNumber}>{score}%</div>
          <div style={styles.scoreText}>Accuracy</div>
        </div>

        {/* Loading state */}
        {loading && (
          <p style={{ color: "#666", fontSize: "1rem" }}>
            Loading game data...
          </p>
        )}

        {/* Error state */}
        {error && <p style={{ color: "#E74C3C", fontSize: "1rem" }}>{error}</p>}

        {/* Games Data Display */}
        {!loading && !error && games.length > 0 && (
          <div
            className="mx-auto"
            style={{ maxWidth: "650px", marginTop: "30px", textAlign: "left" }}
          >
            <h3
              style={{
                fontWeight: "700",
                marginBottom: "20px",
                color: "#1A1A1A",
                textAlign: "center",
              }}
            >
              Latest Game Session
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {games.map((game, index) => {
                // The server stores the recorded game array at `game.game` (per Game2 PATCH)
                // Handle nested arrays (e.g., [[true,false], ...]) by flattening.
                let recorded = [];
                if (Array.isArray(game.game)) recorded = game.game.flat(Infinity);
                const total = recorded.length || 0;
                const correct = total > 0 ? recorded.filter(Boolean).length : 0;
                const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0;
                const level = game.level ?? (total > 0 ? `${total} windows` : "N/A");
                return (
                  <div
                    key={index}
                    style={{
                      padding: "15px",
                      backgroundColor: "#F7F7F7",
                      borderRadius: "12px",
                      borderLeft: "4px solid #F2743E",
                    }}
                  >
                    <p style={{ fontWeight: "600", color: "#1A1A1A", margin: "5px 0" }}>
                      Game ID: <strong>{game._id ?? game.id ?? 'Unknown'}</strong>
                    </p>
                    <p style={{ color: "#666", fontSize: "0.95rem", margin: "5px 0" }}>
                      Level: <strong>{level}</strong>
                    </p>
                    <p style={{ color: "#666", fontSize: "0.95rem", margin: "5px 0" }}>
                      Score: <strong>{scorePercent}%</strong> ({correct}/{total})
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No games data */}
        {!loading && !error && games.length === 0 && (
          <div
            className="mx-auto"
            style={{ maxWidth: "650px", marginTop: "30px" }}
          >
            <p style={{ color: "#999", fontSize: "1rem" }}>
              No games completed yet. Start playing to see your performance
              data!
            </p>
          </div>
        )}

        {/* Download Action */}
        <button
          style={styles.downloadBtn}
          onClick={onDownload}
          onMouseOver={(e) => (e.target.style.opacity = "0.9")}
          onMouseOut={(e) => (e.target.style.opacity = "1")}
        >
          Download Report (PDF)
        </button>
      </div>
    </div>
  );
}

export default PerformanceAnalysis;

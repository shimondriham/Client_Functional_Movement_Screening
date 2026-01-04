import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { doApiGet } from "../services/apiService";


function PerformanceAnalysis() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const score = 80; // Placeholder לציון האמיתי

  useEffect(() => {
    fetchGameData();
  }, []);

  const fetchGameData = async () => {
    try {
      setLoading(true);
      const data = await doApiGet("/games/allUsergames");
      console.log("Games data:", data.data);
      setGames(data.data || []);
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
    },
    card: {
      backgroundColor: "#FFFFFF",
      maxWidth: "900px",
      width: "100%",
      borderRadius: "32px", // פינות מעוגלות מאוד כמו בעיצוב החדש
      padding: "60px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      position: "relative",
      textAlign: "center",
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
              Games Completed
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {games.map((game, index) => (
                <div
                  key={index}
                  style={{
                    padding: "15px",
                    backgroundColor: "#F7F7F7",
                    borderRadius: "12px",
                    borderLeft: "4px solid #F2743E",
                  }}
                >
                  {game.game1 && (
                    <div>
                      <p
                        style={{
                          fontWeight: "600",
                          color: "#1A1A1A",
                          margin: "5px 0",
                        }}
                      >
                        Game 1
                      </p>
                      <p
                        style={{
                          color: "#666",
                          fontSize: "0.9rem",
                          margin: "5px 0",
                        }}
                      >
                        Score: <strong>{game.game1}</strong>
                      </p>
                    </div>
                  )}
                  {game.game2 && (
                    <div>
                      <p
                        style={{
                          fontWeight: "600",
                          color: "#1A1A1A",
                          margin: "5px 0",
                        }}
                      >
                        Game 2
                      </p>
                      <p
                        style={{
                          color: "#666",
                          fontSize: "0.9rem",
                          margin: "5px 0",
                        }}
                      >
                        Score: <strong>{game.game2}</strong>
                      </p>
                    </div>
                  )}
                </div>
              ))}
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

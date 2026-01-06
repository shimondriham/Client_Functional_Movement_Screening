import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addIfShowNav, addIsAdmin, addName } from "../featuers/myDetailsSlice";
import { doApiGet } from "../services/apiService";

// ייבוא הלוגו כ-PNG
import Logo from '../assets/logo.png'; 

const InitializeGames = [
  { id: 1, name: "game1", locked: false },
  { id: 2, name: "game2", locked: true },
  { id: 3, name: "game3", locked: true },
  { id: 4, name: "game4", locked: true },
  { id: 5, name: "game5", locked: true },
];

function Dashboard() {
  const isAdmin = useSelector((state) => state.myDetailsSlice.isAdmin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [ifCompleate, setIfCompleate] = useState(false);
  const [myInfo, setmyInfo] = useState({});
  const [games, setGames] = useState(InitializeGames);

  /* ===== תוספות לבורגר ===== */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBurgerHover, setIsBurgerHover] = useState(false);
  const burgerRef = useRef(null);

  /* ===== סגירה בלחיצה מחוץ לבורגר ===== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (burgerRef.current && !burgerRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===== ניווט מהבורגר ===== */
  const onAdminClick = () => {
    setIsMenuOpen(false);
    navigate("/Admin");
  };

  const onMedicalIntakeFormClick = () => {
    setIsMenuOpen(false);
    navigate("/medicalIntakeForm");
  };

  const onLogout = () => {
    dispatch(addIfShowNav({ ifShowNav: false }));
    setIsMenuOpen(false);
    navigate("/logout");
  };

  useEffect(() => {
    dispatch(addIfShowNav({ ifShowNav: true }));
    doApimyInfo();
    doApimyGames();
  }, [dispatch]);

  const doApimyInfo = async () => {
    let url = "/users/myInfo";
    try {
      let data = await doApiGet(url);
      setmyInfo(data.data);
      dispatch(addName({ name: data.data.fullName }));
      dispatch(addIsAdmin({ isAdmin: data.data.role === "admin" }));

      if (
        data.data.dateOfBirth &&
        data.data.difficulty &&
        data.data.equipment &&
        data.data.frequency &&
        data.data.goal &&
        data.data.height &&
        data.data.medical &&
        data.data.timePerDay &&
        data.data.weight &&
        data.data.workouts
      ) {
        setIfCompleate(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const doApimyGames = async () => {
    let url = "/games/allUsergames";
    try {
      let data = await doApiGet(url);
      if (
        data.data.length > 0 &&
        data.data[data.data.length - 1].game2 != null
      ) {
        setGames([
          { id: 1, name: "game1", locked: true },
          { id: 2, name: "game2", locked: false },
          { id: 3, name: "game3", locked: true },
          { id: 4, name: "game4", locked: true },
          { id: 5, name: "game5", locked: true },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGameClick = (game) => {
    if (!game.locked && ifCompleate) {
      navigate("/instructions", { state: { from: game.name } });
    } else {
      alert("You must complete Game 1 first");
    }
  };

  const handleResultClick = () => {
    navigate("/performanceAnalysis");
  };

  const styles = {
    container: {
      fontFamily: "'Inter', sans-serif", // החלפתי לפונט נקי יותר לניהול הנתונים
      backgroundColor: "#FFFFFF",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "100px",
      position: "relative",
    },
    topBar: {
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 25px",
      width: "100%",
      boxSizing: "border-box",
      backgroundColor: "#FFFFFF",
      zIndex: 100
    },
    // עיצוב הלוגו בפינה
    logoContainer: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center"
    },
    logoImg: {
      width: "110px", 
      height: "auto",
      borderRadius: "12px"
    },
    header: {
      fontSize: "2.5rem",
      fontWeight: "800",
      marginBottom: "8px",
      color: "#1A1A1A",
      fontFamily: "'Inter', sans-serif"
    },
    brandItalic: {
      fontFamily: "'OOOH Baby', cursive",
      fontStyle: "italic",
      fontWeight: "400",
      color: "#F2743E",
    },
    pathContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "20px",
      marginTop: "60px",
      flexWrap: "wrap",
    },
    circle: (isLocked) => ({
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      border: "none",
      backgroundColor: isLocked ? "#F7F7F7" : "#F2743E",
      color: isLocked ? "#CCCCCC" : "#FFFFFF",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: isLocked ? "not-allowed" : "pointer",
      boxShadow: isLocked ? "none" : "0 4px 15px rgba(242, 116, 62, 0.3)",
      transition: "0.3s",
    }),
    resultBtn: {
      position: "fixed",
      bottom: "50px",
      right: "50px",
      padding: "16px 35px",
      fontSize: "1.1rem",
      fontWeight: "700",
      borderRadius: "30px",
      background: "#1A1A1A",
      color: "#FFFFFF",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      transition: "0.3s"
    },
    burgerContainer: {
      position: "relative",
      zIndex: 1000,
    },
    burgerButton: {
      backgroundColor: isBurgerHover ? "#F7F7F7" : "#FFFFFF",
      border: "1px solid #EDEDED",
      borderRadius: "12px",
      padding: "10px 12px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "0.2s",
    },
    burgerIcon: {
      width: "18px",
      height: "14px",
      position: "relative",
      display: "block",
    },
    burgerLine: {
      position: "absolute",
      left: "0",
      right: "0",
      margin: "auto",
      width: "18px",
      height: "2px",
      backgroundColor: "#1A1A1A",
      borderRadius: "2px",
      transition: "0.25s",
    },
    line1: { top: isMenuOpen ? "6px" : "0", transform: isMenuOpen ? "rotate(45deg)" : "none" },
    line2: { top: "6px", opacity: isMenuOpen ? 0 : 1 },
    line3: { top: isMenuOpen ? "6px" : "12px", transform: isMenuOpen ? "rotate(-45deg)" : "none" },

    dropdownMenu: {
      position: "absolute",
      top: "calc(100% + 8px)",
      right: "0",
      minWidth: "220px",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      padding: "8px 0",
      zIndex: 3000,
      border: "1px solid #F0F0F0"
    },
    dropdownItem: {
      background: "none",
      border: "none",
      width: "100%",
      textAlign: "left",
      padding: "12px 20px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      color: "#1A1A1A",
      transition: "0.2s"
    },
  };

  return (
    <div style={styles.container}>
      {/* Top Bar המכיל לוגו PNG משמאל והמבורגר מימין */}
      <div style={styles.topBar}>
        <div style={styles.logoContainer} onClick={() => navigate("/")}>
          <img src={Logo} alt="Fitwave.ai" style={styles.logoImg} />
        </div>

        <div style={styles.burgerContainer} ref={burgerRef}>
          <button
            type="button"
            style={styles.burgerButton}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            onMouseEnter={() => setIsBurgerHover(true)}
            onMouseLeave={() => setIsBurgerHover(false)}
          >
            <span style={styles.burgerIcon}>
              <span style={{ ...styles.burgerLine, ...styles.line1 }} />
              <span style={{ ...styles.burgerLine, ...styles.line2 }} />
              <span style={{ ...styles.burgerLine, ...styles.line3 }} />
            </span>
          </button>

          {isMenuOpen && (
            <div style={styles.dropdownMenu}>
              {isAdmin && (
                <button 
                    style={styles.dropdownItem} 
                    onClick={onAdminClick}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#F7F7F7'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Admin Panel
                </button>
              )}
              <button
                style={styles.dropdownItem}
                onClick={onMedicalIntakeFormClick}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F7F7F7'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Medical Intake
              </button>
              <div style={{ height: '1px', backgroundColor: '#F0F0F0', margin: '4px 0' }} />
              <button 
                style={{ ...styles.dropdownItem, color: '#F2743E' }} 
                onClick={onLogout}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F7F7F7'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <h1 style={styles.header}>
        Your <span style={styles.brandItalic}>Training</span> Path
      </h1>

      <div style={styles.pathContainer}>
        {games.map((game, idx) => (
          <React.Fragment key={game.id}>
            <button
              style={styles.circle(game.locked || !ifCompleate)}
              onClick={() => handleGameClick(game)}
            >
              {game.name}
            </button>
            {idx < games.length - 1 && <span style={{ color: '#DDD', fontSize: '1.5rem' }}>→</span>}
          </React.Fragment>
        ))}
      </div>

      <button 
        style={styles.resultBtn} 
        onClick={handleResultClick}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        Performance Result
      </button>
    </div>
  );
}

export default Dashboard;
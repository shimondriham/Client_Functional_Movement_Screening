import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addIfShowNav, addIsAdmin, addName } from '../featuers/myDetailsSlice';
import { doApiGet } from '../services/apiService';

const InitializeGames = [
  { id: 1, name: 'game1', locked: false },
  { id: 2, name: 'game2', locked: true },
  { id: 3, name: 'game3', locked: true },
  { id: 4, name: 'game4', locked: true },
  { id: 5, name: 'game5', locked: true },
  { id: 6, name: 'game6', locked: true }
];

function Dashboard() {
  const IsAdmin = useSelector(state => state.myDetailsSlice.isAdmin);
  const navigate = useNavigate();
  const [ifCompleate, setIfCompleate] = useState(false);
  const [myInfo, setmyInfo] = useState({});
  const [games, setGames] = useState(InitializeGames);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addIfShowNav({ ifShowNav: true }));
    doApimyInfo();
    doApimyGames();
  }, []);

  const doApimyInfo = async () => {
    let url = "/users/myInfo";
    try {
      let data = await doApiGet(url);
      setmyInfo(data.data);
      dispatch(addName({ name: data.data.fullName }));
      if (data.data.role == "admin") {
        dispatch(addIsAdmin({ isAdmin: true }));
      }
      // שמירה על הבדיקה המקורית שלך
      if (data.data.dateOfBirth && data.data.difficulty && data.data.equipment && data.data.frequency && data.data.goal && data.data.height && data.data.medical && data.data.timePerDay && data.data.weight && data.data.workouts) {
        setIfCompleate(true);
        console.log(true);
      }
      console.log(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const doApimyGames = async () => {
    let url = "/games/allUsergames";
    try {
      let data = await doApiGet(url);
      console.log(data.data);
      // שמירה על הלוגיקה המקורית של פתיחת משחקים
      if (data.data.length > 0 && data.data[data.data.length - 1].game2 != null) {
        setGames([
          { id: 1, name: 'game1', locked: true },
          { id: 2, name: 'game2', locked: false },
          { id: 3, name: 'game3', locked: true },
          { id: 4, name: 'game4', locked: true },
          { id: 5, name: 'game5', locked: true },
          { id: 6, name: 'game6', locked: true }
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleGameClick = (game) => {
    if (!game.locked && ifCompleate) {
      navigate('/instructions', { state: { from: game.name } });
    } else {
      alert('You must complete Game 1 first');
    }
  };

  const handleResultClick = () => {
    navigate('/performanceAnalysis');
  };

  // אובייקט העיצוב (CSS-in-JS)
  const styles = {
    container: {
      fontFamily: "'OOOH Baby', cursive, sans-serif",
      backgroundColor: '#FFFFFF',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '80px',
      position: 'relative'
    },
    logo: {
      position: 'absolute',
      top: '20px',
      left: '25px',
      fontSize: '1.2rem',
      fontWeight: '700'
    },
    header: {
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '8px'
    },
    brandItalic: {
      fontFamily: 'cursive',
      fontStyle: 'italic',
      fontWeight: '400',
      color: '#F2743E'
    },
    pathContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '20px',
      marginTop: '60px',
      flexWrap: 'wrap'
    },
    circle: (isLocked) => ({
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: isLocked ? '#F7F7F7' : '#F2743E',
      color: isLocked ? '#CCCCCC' : '#FFFFFF',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: isLocked ? 'not-allowed' : 'pointer',
      boxShadow: isLocked ? 'none' : '0 4px 15px rgba(242, 116, 62, 0.3)',
      transition: '0.3s'
    }),
    resultBtn: {
      position: 'fixed',
      bottom: '50px',
      right: '80px',
      padding: '16px 35px',
      fontSize: '1.1rem',
      fontWeight: '700',
      borderRadius: '12px',
      background: 'white',
      color: '#1A1A1A',
      border: '2px solid #F0F0F0',
      cursor: 'pointer',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    footer: {
      position: 'fixed',
      bottom: '20px',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 40px',
      fontSize: '0.8rem',
      color: '#999'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.logo}>Fitwave.ai</div>

      <h1 style={styles.header}>
        Your <span style={styles.brandItalic}>Training</span> Path
      </h1>
      <p style={{ color: '#666' }}>Follow the path to reach your vitality goals</p>

      <div style={styles.pathContainer}>
        {games.map((game, idx) => (
          <React.Fragment key={game.id}>
            <button
              type="button"
              style={styles.circle(game.locked || !ifCompleate)}
              onClick={() => handleGameClick(game)}
            >
              {game.name}
            </button>

            {idx < games.length - 1 && (
              <span style={{ fontSize: '24px', color: '#EEE' }}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        type="button"
        onClick={handleResultClick}
        style={styles.resultBtn}
        onMouseOver={(e) => e.target.style.borderColor = '#F2743E'}
        onMouseOut={(e) => e.target.style.borderColor = '#F0F0F0'}
      >
        Result
      </button>

     
    </div>
  );
}

export default Dashboard;
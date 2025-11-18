// import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { doApiGet } from '../services/apiService';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f8f8f8'
  },
  logo: {
    fontSize: 24,
    textAlign: 'center',
    margin: '32px 0 40px 0'
  },
  circlesRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    margin: '40px 0'
  },
  circleButton: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: '#d6d6d6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 23,
    border: 'none',
    cursor: 'pointer'
  },
  resultBtn: {
    position: 'absolute',
    bottom: 50,
    right: 80,
    padding: '18px 40px',
    fontSize: 22,
    borderRadius: 8,
    background: 'white',
    border: '3px solid #cfcfcf',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  homeIcon: {
    position: 'absolute',
    left: 70,
    top: 40
  }
};


function Dashboard() {
  const navigate = useNavigate();
  const name = useSelector(state => state.myDetailsSlice?.name || 'Guest');
  const [ifFill, setifFill] = useState(false);
  const [myInfo, setmyInfo] = useState({});

useEffect(() => {
  doApi()
}, []);

const doApi = async () => {
  let url = "/users/myInfo";
  try {
    let data = await doApiGet(url);
    console.log(data);
    if (data.data.height && data.data.weight && data.data.dateOfBirth) {
      setifFill(true);
    }
    setmyInfo(data.data);
  } catch (error) {
    console.log(error);
  }
}

  const handleGame = () => {
    ifFill ? navigate('/gameList') :
      alert('Fill Medical Intake Form!');

  };

  const handlePhysio = () => {
    ifFill ? navigate('/practiceList') :
      alert('Fill Medical Intake Form!');
  }

  const handleComingSoon = () => {
    alert('Coming Soon!');
  }

  return (
    <div style={styles.container}>
      <div style={styles.logo}>Welcome -  {name}</div>
      <div style={styles.circlesRow}>
        <button style={styles.circleButton} onClick={handlePhysio} > Physio</button>
        <button style={styles.circleButton} onClick={handleComingSoon}>Strength</button>
        <button style={styles.circleButton} onClick={handleComingSoon}>Flexibility</button>
        <button style={styles.circleButton} onClick={handleComingSoon}>Cardio</button>
        <button style={styles.circleButton} onClick={handleComingSoon}>Relax</button>
        <button style={styles.circleButton} onClick={handleGame}>Game</button>
      </div>
    </div>
  );
}

export default Dashboard;

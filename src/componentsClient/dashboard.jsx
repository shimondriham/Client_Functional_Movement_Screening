import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addIfShowNav, addIsAdmin, addName } from '../featuers/myDetailsSlice';
import { doApiGet } from '../services/apiService';

const games = [
  { id: 1, name: 'game1', locked: false },
  { id: 2, name: 'game2', locked: true },
  { id: 3, name: 'game3', locked: true },
  { id: 4, name: 'game4', locked: true },
  { id: 5, name: 'game5', locked: true },
  { id: 6, name: 'game6', locked: true },
];

function Dashboard() {
    const IsAdmin = useSelector(state => state.myDetailsSlice.isAdmin);
    const navigate = useNavigate();
    const [ifCompleate, setIfCompleate] = useState(false);
    const [myInfo, setmyInfo] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(addIfShowNav({ ifShowNav: true }));
        doApi()
    }, []);

    const doApi = async () => {
        let url = "/users/myInfo";
        try {
            let data = await doApiGet(url);
            setmyInfo(data.data);
            dispatch(addName({ name: data.data.fullName }));
            if (data.data.role == "admin") {
                dispatch(addIsAdmin({ isAdmin: true }));
            }
            if (data.data.dateOfBirth && data.data.difficulty && data.data.equipment && data.data.frequency && data.data.goal && data.data.height && data.data.medical && data.data.timePerDay && data.data.weight && data.data.workouts) {
              setIfCompleate(true);
              console.log(true);
              
            }
            console.log(data.data);
            
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

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ background: '#f8f8f8' }}>
      <div className="text-center my-4" style={{ fontSize: 24 }}>
        Logo
      </div>

      {/* Circles row */}
      <div className="d-flex justify-content-center align-items-center my-4 gap-4">
        {games.map((game, idx) => (
          <React.Fragment key={game.id}>
            <button
              type="button"
              className="btn d-flex justify-content-center align-items-center position-relative"
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: '#d6d6d6',
                fontSize: 23,
                border: 'none',
                cursor: game.locked || !ifCompleate ? 'not-allowed' : 'pointer',
                opacity: game.locked || !ifCompleate ? 0.6 : 1,
              }}
              onClick={() => handleGameClick(game)}
            >
              {game.name}
              {/* {game.locked  && (
                <span
                  className="position-absolute"
                  style={{ right: 18, top: 18, fontSize: 24 }}
                >
                  🔒
                </span>
              )} */}
            </button>

            {idx < games.length - 1 && (
              <span style={{ fontSize: 28 }}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Result button fixed bottom-right */}
      <button
        type="button"
        onClick={handleResultClick}
        className="btn fw-bold position-fixed"
        style={{
          bottom: 50,
          right: 80,
          padding: '18px 40px',
          fontSize: 22,
          borderRadius: 8,
          background: 'white',
          border: '3px solid #cfcfcf',
          cursor: 'pointer',
        }}
      >
        Result
      </button>
    </div>
  );
}

export default Dashboard;

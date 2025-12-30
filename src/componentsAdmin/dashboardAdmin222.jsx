import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { doApiGet } from "../services/apiService";

function DashboardAdmin222() {
  const initialUsers = [
    { _id: 1111, dateCreated: "2025-10-10T12:00:00", level:"start", game1: [true,false,true], game2: [true,false,true] },
    { _id: 22222, dateCreated: "2025-11-10T14:30:00", level:"start", game1: [true,false,true], game2: [true,false,true] },
  ];

  let [ar, setAr] = useState(initialUsers);
  const ThisID = useSelector((state) => state.myDetailsSlice.idMorInfoAdmin);
  const [thisUser, setThisUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    doApiUser();
    doApiQ();
  }, []);

  const doApiUser = async () => {
    let url = "/users/single/" + ThisID;
    try {
      let data = await doApiGet(url);
      console.log(data.data);
      setThisUser(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const doApiQ = async () => {
    let url = "/games/usergames/" + ThisID;
    try {
      let data = await doApiGet(url);
      console.log(data.data);
      
      setAr(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const toAdminResult = (id) => {
  //   // navigate('/performanceAnalysisAdmin', { state: { gameId: id } });
  // };

  const uiStyle = {
    wrapper: { fontFamily: "'Inter', sans-serif", padding: '20px', color: '#1A1A1A' },
    headerCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      padding: '30px',
      marginBottom: '20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      textAlign: 'center',
      border: '1px solid #F0F0F0'
    },
    brandItalic: { fontFamily: 'cursive', fontStyle: 'italic', color: '#F2743E', fontWeight: '400' },
    statsRow: { display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' },
    statCard: {
      flex: 1,
      minWidth: '200px',
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      padding: '20px',
      textAlign: 'center',
      border: '1px solid #F0F0F0',
      boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
    },
    tableWrapper: {
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      border: '1px solid #F0F0F0'
    },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0' },
    th: {
      backgroundColor: '#F7F7F7', padding: '16px 20px', fontSize: '0.85rem',
      fontWeight: '700', textTransform: 'uppercase', color: '#666', borderBottom: '1px solid #EEE'
    },
    td: { padding: '16px 20px', fontSize: '0.95rem', borderBottom: '1px solid #F7F7F7', color: '#333' },
    actionBtn: {
      backgroundColor: '#F2743E', color: 'white', border: 'none', borderRadius: '12px',
      width: '36px', height: '36px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', cursor: 'pointer', transition: '0.3s'
    }
  };

  return (
    <div style={uiStyle.wrapper} className="container">
      {/* Header */}
      <div style={uiStyle.headerCard}>
        <h1 style={{ fontWeight: '800', marginBottom: '5px' }}>
          User <span style={uiStyle.brandItalic}>Details</span>
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Viewing records for: <strong>{thisUser.fullName || "Loading..."}</strong>
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div style={uiStyle.statsRow}>
        <div style={uiStyle.statCard}>
          <div style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase' }}>Total Sessions</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#F2743E' }}>{ar.length}</div>
        </div>
        <div style={uiStyle.statCard}>
          <div style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase' }}>Member Since</div>
          <div style={{ fontSize: '1.2rem', fontWeight: '700', marginTop: '8px' }}>Oct 2025</div>
        </div>
        <div style={uiStyle.statCard}>
          <div style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase' }}>Avg. Score</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#28a745' }}>84%</div>
        </div>
      </div>

      {/* Sessions Table */}
      <div style={uiStyle.tableWrapper}>
        <table style={uiStyle.table}>
          <thead>
            <tr>
              <th style={uiStyle.th}>#</th>
              <th style={uiStyle.th}>Date & Time</th>
              <th style={uiStyle.th}>level</th>
              <th style={uiStyle.th}>game1</th>
              <th style={uiStyle.th}>game2</th>
              {/* <th style={uiStyle.th} className="text-center">Analysis</th> */}
            </tr>
          </thead>
          <tbody>
            {ar.map((game, index) => (
              <tr key={index} className="admin-table-row">
                <td style={uiStyle.td}>{index + 1}</td>
                <td style={uiStyle.td}>
                  {game.dateCreated ? new Date(game.dateCreated).toLocaleDateString('he-IL') : ""}
                </td>
                <td style={uiStyle.td}>{game.level}</td>
                <td style={uiStyle.td}>
  {game.game1.length > 0 
    ? `${game.game1.filter(value => value === true).length} / ${game.game1.length}` 
    : "uncomplete"}
</td>
<td style={uiStyle.td}>
  {game.game2.length > 0 
    ? `${game.game2.filter(value => value === true).length} / ${game.game2.length}` 
    : "uncomplete"}
</td>               
 {/* <td style={uiStyle.td}>
                  <div className="d-flex justify-content-center">
                    <button
                      style={uiStyle.actionBtn}
                      onClick={() => toAdminResult(game._id)}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>
        {`
          .admin-table-row:hover { background-color: #FAFAFA; }
          .admin-table-row:last-child td { border-bottom: none; }
        `}
      </style>
    </div>
  );
}

export default DashboardAdmin222;
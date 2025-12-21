import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteToken } from "../services/localService"
import { addIfShowNav } from '../featuers/myDetailsSlice'
import { useDispatch } from 'react-redux'

function LogoutClient() {
  let nav = useNavigate()
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(true);

  const handleLogout = () => {
    deleteToken();
    dispatch(addIfShowNav({ ifShowNav: true }));
    nav("/");
    window.location.reload();
  };

  const cancelLogout = () => {
    setShowConfirm(false);
    nav("/dashboard");
  };

  // Styles based on Fitwave.ai design
  const uiStyle = {
    wrapper: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#F7F7F7',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    card: {
      backgroundColor: '#FFFFFF',
      maxWidth: '400px',
      width: '100%',
      borderRadius: '32px',
      padding: '40px',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
    },
    brandItalic: {
      fontFamily: 'cursive',
      fontStyle: 'italic',
      fontWeight: '400',
      color: '#F2743E'
    },
    logoutBtn: {
      backgroundColor: '#F2743E',
      color: 'white',
      border: 'none',
      borderRadius: '30px',
      padding: '12px 30px',
      fontWeight: '700',
      fontSize: '1rem',
      width: '100%',
      marginBottom: '12px',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(242, 116, 62, 0.3)'
    },
    cancelBtn: {
      backgroundColor: 'transparent',
      color: '#666',
      border: 'none',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer'
    }
  };

  return (
    <div style={uiStyle.wrapper}>
      {showConfirm && (
        <div style={uiStyle.card}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>👋</div>
          <h2 style={{ fontWeight: '800', marginBottom: '10px' }}>
            Logging <span style={uiStyle.brandItalic}>Out</span>?
          </h2>
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '0.95rem' }}>
            Are you sure you want to end your vitality session? Your progress is saved.
          </p>
          
          <button style={uiStyle.logoutBtn} onClick={handleLogout}>
            Yes, Log out
          </button>
          
          <button style={uiStyle.cancelBtn} onClick={cancelLogout}>
            Stay Logged In
          </button>
        </div>
      )}
    </div>
  );
}

export default LogoutClient;
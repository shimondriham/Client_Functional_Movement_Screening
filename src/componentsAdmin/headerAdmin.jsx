import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

// ייבוא הלוגו כ-PNG
import Logo from '../assets/logo.png';

function HeaderAdmin() {
  const nav = useNavigate();
  const location = useLocation();

  const onHomeClick = () => {
    nav("/dashboard");
  }
  const onDashboardAdminClick = () => {
    nav("/admin");
  }

  // Styles based on Fitwave.ai design line
  const uiStyle = {
    headerWrapper: {
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #EEE',
      padding: '15px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
      fontFamily: "'Inter', sans-serif" // עדכון לפונט נקי התואם לשאר הדפים
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer'
    },
    logoImg: {
      width: '110px', // גודל קומפקטי שמתאים ל-Header
      height: 'auto',
      borderRadius: '12px'
    },
    adminTag: {
      fontSize: '0.85rem',
      color: '#999',
      fontWeight: '600',
      letterSpacing: '0.5px',
      textTransform: 'uppercase'
    },
    navGroup: {
      display: 'flex',
      gap: '12px'
    },
    navBtn: (isActive) => ({
      padding: '8px 20px',
      borderRadius: '20px',
      border: isActive ? 'none' : '1px solid #EEE',
      backgroundColor: isActive ? '#F2743E' : 'transparent',
      color: isActive ? '#FFFFFF' : '#666',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: '0.3s',
      boxShadow: isActive ? '0 4px 12px rgba(242, 116, 62, 0.2)' : 'none'
    })
  };

  return (
    <header style={uiStyle.headerWrapper}>
      {/* Brand Section - הוחלף בתמונה + המילה Admin */}
      <div style={uiStyle.logoSection} onClick={() => nav("/")}>
        <img src={Logo} alt="Fitwave.ai" style={uiStyle.logoImg} />
        <span style={uiStyle.adminTag}>Admin</span>
      </div>

      {/* Navigation Section - ללא שינוי בעיצוב */}
      <div style={uiStyle.navGroup}>
        <button 
          style={uiStyle.navBtn(location.pathname === "/admin")} 
          onClick={onDashboardAdminClick}
        >
          Admin Panel
        </button>
        
        <button 
          style={uiStyle.navBtn(location.pathname === "/dashboard")} 
          onClick={onHomeClick}
        >
          Client View
        </button>
      </div>
    </header>
  );
}

export default HeaderAdmin;
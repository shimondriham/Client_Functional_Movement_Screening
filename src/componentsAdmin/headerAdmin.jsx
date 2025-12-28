import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

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
      fontFamily: "'OOh Baby', cursive, sans-serif"
    },
    logoSection: {
      fontWeight: 'bold',
      fontSize: '1.2rem',
      cursor: 'pointer'
    },
    brandItalic: {
      fontFamily: 'cursive',
      fontStyle: 'italic',
      fontWeight: '400',
      color: '#F2743E'
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
      {/* Brand Section */}
      <div style={uiStyle.logoSection} onClick={() => nav("/")}>
        Fitwave<span style={uiStyle.brandItalic}>.ai</span> <span style={{fontSize: '0.8rem', color: '#999', marginLeft: '5px'}}>Admin</span>
      </div>

      {/* Navigation Section */}
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
import React from 'react'
import { Outlet } from 'react-router-dom';
import HeaderAdmin from './headerAdmin';

function LayoutAdmin() {
  // סגנונות עבור מעטפת האדמין
  const styles = {
    layoutWrapper: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#F7F7F7', // הרקע האפור הבהיר של המותג
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    contentArea: {
      flex: 1,
      padding: '40px 20px',
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      // מבטיח שהתוכן הפנימי תמיד יקבל את המראה הנקי
      animation: 'fadeIn 0.5s ease-in-out'
    },
    footer: {
      textAlign: 'center',
      padding: '20px',
      fontSize: '0.85rem',
      color: '#999',
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid #EEE'
    }
  };

  return (
    <div style={styles.layoutWrapper}>
      {/* ה-Header של האדמין יקבל את העיצוב שלו בנפרד, כאן הוא מוטמע כחלק מהמבנה */}
      <HeaderAdmin />
      
      <main style={styles.contentArea}>
        <Outlet />
      </main>

      <footer style={styles.footer}>
        <div className="container d-flex justify-content-between align-items-center">
          <span>© Fitwave.ai 2026 | Admin Portal</span>
          <span style={{ fontWeight: '600', color: '#F2743E' }}>Vitality Dashboard</span>
        </div>
      </footer>

      {/* הוספת אנימציה עדינה למעברים בין דפים */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  )
}

export default LayoutAdmin;
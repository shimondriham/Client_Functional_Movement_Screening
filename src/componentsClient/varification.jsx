import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doApiMethod } from '../services/apiService';

// ייבוא הלוגו כ-PNG
import Logo from '../assets/logo.png';

const Varification = () => {
  let nav = useNavigate();
  const myEmail = useSelector(state => state.myDetailsSlice.email);
  const [code, setCode] = useState(['', '', '', '', '']);

  const handleChange = (event, index) => {
    const value = event.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 4) {
        document.getElementById(`input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`input-${index - 1}`).focus();
    }
  };

  const isCodeComplete = code.every((digit) => digit !== '');

  const handleSubmit = () => {
    const codeString = code.join('');
    let _dataObg = {
      email: myEmail,
      verificationCode: codeString,
    }
    doApi(_dataObg)
  };

  const doApi = async (_dataBody) => {
    let url = "/users/verification";
    try {
      let resp = await doApiMethod(url, "PATCH", _dataBody);
      if (resp.data.status === 200 || resp.status === 200) {
        nav("/login");
      }
    }
    catch (error) {
      console.log(error.response?.data);
      alert("Invalid verification code, please try again.");
    }
  }

  const uiStyle = {
    wrapper: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#FFFFFF',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center', // ממרכז את התוכן אנכית
      position: 'relative',
      padding: '0 20px'
    },
    logoContainer: {
      position: 'absolute',
      top: '30px',
      left: '30px',
      cursor: 'pointer'
    },
    logoImg: {
      width: '130px', // גודל אחיד לכל המערכת
      height: 'auto',
      borderRadius: '12px'
    },
    header: {
      fontSize: '2.2rem',
      fontWeight: '700',
      marginBottom: '10px',
      color: '#1A1A1A',
      textAlign: 'center'
    },
    brandName: {
      fontWeight: '700'
    },
    subHeader: {
      color: '#666',
      fontSize: '1rem',
      marginBottom: '40px',
      maxWidth: '400px',
      textAlign: 'center',
      lineHeight: '1.5'
    },
    input: {
      width: '55px',
      height: '65px',
      fontSize: '24px',
      textAlign: 'center',
      backgroundColor: '#F7F7F7',
      border: '2px solid transparent',
      borderRadius: '12px',
      fontWeight: '600',
      outline: 'none',
      transition: 'all 0.2s ease',
      margin: '0 5px'
    },
    inputFocus: {
        borderColor: '#F2743E',
        backgroundColor: '#FFFFFF'
    },
    button: {
      backgroundColor: '#F2743E',
      color: 'white',
      border: 'none',
      borderRadius: '30px',
      padding: '14px',
      fontWeight: '600',
      fontSize: '1.1rem',
      marginTop: '40px',
      width: '100%',
      maxWidth: '320px',
      cursor: 'pointer',
      transition: 'opacity 0.3s',
      opacity: isCodeComplete ? 1 : 0.6
    },
    resendText: {
        marginTop: '30px', 
        fontSize: '14px', 
        color: '#666'
    },
    resendLink: { 
        color: '#F2743E', 
        fontWeight: '600', 
        cursor: 'pointer',
        marginLeft: '5px'
    }
  };

  return (
    <div style={uiStyle.wrapper}>
      {/* הלוגו בפינה השמאלית העליונה */}
      <div style={uiStyle.logoContainer} onClick={() => nav("/")}>
        <img src={Logo} alt="Fitwave.ai" style={uiStyle.logoImg} />
      </div>

      <h1 style={uiStyle.header}>
        Account <span style={uiStyle.brandName}>Verification</span>
      </h1>
      
      <p style={uiStyle.subHeader}>
        Enter the 5-digit security code we sent to: <br />
        <strong style={{ color: '#1A1A1A' }}>{myEmail || "your email"}</strong>
      </p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {code.map((value, index) => (
          <input
            key={index}
            id={`input-${index}`}
            type="text"
            style={uiStyle.input}
            maxLength="1"
            value={value}
            onChange={(event) => handleChange(event, index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onFocus={(e) => {
                e.target.style.borderColor = '#F2743E';
                e.target.style.backgroundColor = '#FFFFFF';
            }}
            onBlur={(e) => {
                e.target.style.borderColor = 'transparent';
                e.target.style.backgroundColor = '#F7F7F7';
            }}
            autoFocus={index === 0}
          />
        ))}
      </div>

      <button
        style={uiStyle.button}
        onClick={handleSubmit}
        disabled={!isCodeComplete}
      >
        Verify Account
      </button>

      <div style={uiStyle.resendText}>
        Didn't receive the code? 
        <span style={uiStyle.resendLink}>Resend</span>
      </div>
    </div>
  );
}

export default Varification;
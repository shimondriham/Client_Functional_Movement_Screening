import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doApiMethod } from '../services/apiService';
import thisIcon from '../assets/icon.png';

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
    console.log(_dataBody);
    let url = "/users/verification";
    try {
      let resp = await doApiMethod(url, "PATCH", _dataBody);
      console.log(resp);
      // שים לב: בתיקון קטן השתמשתי ב-== להשוואה (במקום = שהיה במקור) כדי למנוע באגים עתידיים
      if (resp.data.status == 200 || resp.status == 200) {
        console.log("You are now a valid user");
        nav("/login");
      }
    }
    catch (error) {
      console.log(error.response?.data);
    }
  }

  // אובייקט עיצוב אחיד
  const uiStyle = {
    wrapper: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#FFFFFF',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '100px',
      position: 'relative'
    },
    logo: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      fontSize: '1.2rem',
      fontWeight: 'bold'
    },
    header: {
      fontSize: '2rem',
      fontWeight: '700',
      marginBottom: '8px',
      color: '#000'
    },
    brandItalic: {
      fontFamily: 'cursive',
      fontStyle: 'italic',
      fontWeight: '400'
    },
    subHeader: {
      color: '#666',
      fontSize: '0.95rem',
      marginBottom: '40px',
      maxWidth: '350px',
      textAlign: 'center'
    },
    input: {
      width: '55px',
      height: '65px',
      fontSize: '24px',
      textAlign: 'center',
      backgroundColor: '#F7F7F7',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '600',
      outline: 'none',
      transition: '0.3s'
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
      opacity: isCodeComplete ? 1 : 0.6
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
    <div style={uiStyle.wrapper}>
      <div style={uiStyle.logo}>🏆 Fitwave.ai</div>

      <h1 style={uiStyle.header}>
        Account <span style={uiStyle.brandItalic}>Verification</span>
      </h1>
      
      <p style={uiStyle.subHeader}>
        Enter the 5-digit security code we sent to: <br />
        <strong style={{ color: '#000' }}>{myEmail || "your email"}</strong>
      </p>

      <div className="d-flex justify-content-center gap-2">
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

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
       <span style={{ color: '#F2743E', fontWeight: '600', cursor: 'pointer' }}>Resend</span>
      </div>

      
    </div>
  );
}

export default Varification;
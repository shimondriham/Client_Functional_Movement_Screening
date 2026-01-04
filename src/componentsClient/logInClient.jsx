import React from 'react';
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addEmail, addIfShowNav, addName } from '../featuers/myDetailsSlice';
import { doApiMethod } from '../services/apiService';
import { saveTokenLocal } from '../services/localService';

// וודאי שהקובץ נמצא בתיקיית assets שלך
import Logo from '../assets/logo.png'; 

const LoginClient = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubForm = (data) => {
    doApi(data);
  };

  const doApi = async (_dataBody) => {
    const url = "/users/login";
    try {
      const resp = await doApiMethod(url, "POST", _dataBody);
      if (resp.data.token) {
        saveTokenLocal(resp.data.token);
        dispatch(addName({ name: resp.data.fullName || resp.data.name || "User" }));
        dispatch(addEmail({ email: _dataBody.email }));
        dispatch(addIfShowNav({ ifShowNav: true }));
        nav("/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data?.error || error.message);
      alert(error.response?.data?.error || "Login failed, please check your credentials");
    }
  };

  const uiStyle = {
    wrapper: {
      backgroundColor: '#FFFFFF',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center', 
      position: 'relative', 
      fontFamily: "'Inter', sans-serif",
    },
    logoContainer: {
      position: 'absolute',
      top: '30px',
      left: '30px',
      cursor: 'pointer'
    },
    logoImg: {
      width: '130px', 
      height: 'auto',
      display: 'block',
      // --- השינוי כאן ---
      borderRadius: '12px' // עיגול פינות עדין שמתאים לשדות הקלט
    },
    header: {
      fontSize: '2.2rem',
      fontWeight: '700',
      marginBottom: '10px',
      color: '#1A1A1A',
      textAlign: 'center'
    },
    subHeader: {
      color: '#666',
      fontSize: '1rem',
      marginBottom: '40px',
      textAlign: 'center'
    },
    form: {
      width: '100%',
      maxWidth: '400px',
      padding: '0 20px'
    },
    label: {
      display: 'block',
      textAlign: 'left',
      fontSize: '0.85rem',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#1A1A1A',
      paddingLeft: '4px'
    },
    input: {
      backgroundColor: '#F7F7F7',
      border: '1px solid #EDEDED',
      borderRadius: '12px', // תואם ללוגו עכשיו
      padding: '14px 20px',
      fontSize: '1rem',
      marginBottom: '4px',
      width: '100%',
      outline: 'none',
      transition: 'all 0.2s ease'
    },
    button: {
      backgroundColor: '#F2743E', 
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '30px',
      padding: '14px',
      fontWeight: '600',
      fontSize: '1.1rem',
      marginTop: '24px',
      width: '100%',
      cursor: 'pointer',
      transition: 'transform 0.1s active'
    },
    link: {
      color: '#F2743E',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none'
    }
  };

  return (
    <div style={uiStyle.wrapper}>
      {/* הלוגו בצד שמאל למעלה עם פינות מעוגלות */}
      <div style={uiStyle.logoContainer} onClick={() => nav("/")}>
        <img src={Logo} alt="Fitwave.ai" style={uiStyle.logoImg} />
      </div>

      <h1 style={uiStyle.header}>Welcome Back</h1>
      <p style={uiStyle.subHeader}>Start your journey to your vitality</p>

      <div style={uiStyle.form}>
        <form onSubmit={handleSubmit(onSubForm)}>
          <div className="mb-4">
            <label style={uiStyle.label}>Email*</label>
            <input 
              {...register("email", { 
                required: "Email is required", 
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" } 
              })} 
              type="email" 
              placeholder="Enter your email" 
              style={uiStyle.input}
              onFocus={(e) => e.target.style.borderColor = '#F2743E'}
              onBlur={(e) => e.target.style.borderColor = '#EDEDED'}
            />
            {errors.email && <small className="text-danger d-block text-start mt-1" style={{fontSize:'0.75rem'}}>{errors.email.message}</small>}
          </div>

          <div className="mb-4">
            <label style={uiStyle.label}>Password*</label>
            <input 
              {...register("password", { 
                required: "Password is required", 
                minLength: { value: 3, message: "Min 3 characters" } 
              })} 
              type="password" 
              placeholder="Enter your password" 
              style={uiStyle.input}
              onFocus={(e) => e.target.style.borderColor = '#F2743E'}
              onBlur={(e) => e.target.style.borderColor = '#EDEDED'}
            />
            {errors.password && <small className="text-danger d-block text-start mt-1" style={{fontSize:'0.75rem'}}>{errors.password.message}</small>}
          </div>

          <button style={uiStyle.button} type="submit">
            Sign In
          </button>
        </form>

        <div className='mt-4 text-center'>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Don't have an account?{' '}
            <span onClick={() => nav("/SignUp")} style={uiStyle.link}>
              Create account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginClient;
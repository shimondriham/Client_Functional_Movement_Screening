import React from 'react';
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addEmail, addIfShowNav, addName } from '../featuers/myDetailsSlice';
import { doApiMethod } from '../services/apiService';
import { saveTokenLocal } from '../services/localService';

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
        // שאיבת השם מהתגובה של השרת - בטוח יותר
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

  // אובייקט עיצוב אחיד לפי הקו של Fitwave.ai
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
    logoBox: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      fontSize: '1.2rem',
      fontWeight: 'bold'
    },
    header: {
      fontSize: '2.2rem',
      fontWeight: '700',
      marginBottom: '10px',
      color: '#1A1A1A'
    },
    brandItalic: {
      fontFamily: 'cursive',
      fontStyle: 'italic',
      fontWeight: '400'
    },
    subHeader: {
      color: '#666',
      fontSize: '0.95rem',
      marginBottom: '40px'
    },
    form: {
      width: '100%',
      maxWidth: '400px',
      padding: '0 20px'
    },
    label: {
      display: 'block',
      textAlign: 'left',
      fontSize: '0.9rem',
      fontWeight: '600',
      marginBottom: '8px',
      marginLeft: '4px',
      color: '#1A1A1A'
    },
    input: {
      backgroundColor: '#F7F7F7',
      border: 'none',
      borderRadius: '12px',
      padding: '14px 20px',
      fontSize: '1rem',
      marginBottom: '4px',
      width: '100%'
    },
    button: {
      backgroundColor: '#F2743E', // הכתום מהתמונה
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '30px',
      padding: '14px',
      fontWeight: '600',
      fontSize: '1.1rem',
      marginTop: '24px',
      width: '100%',
      cursor: 'pointer',
      transition: 'background 0.3s'
    },
    link: {
      color: '#F2743E',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none'
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
      {/* לוגו עליון */}
      <div style={uiStyle.logoBox}>
        🏆 Fitwave.ai
      </div>

      <h1 style={uiStyle.header}>
        Welcome to <span style={uiStyle.brandItalic}>Fitwave.ai</span>
      </h1>
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
              className="form-control shadow-none" 
              placeholder="Enter your email" 
              style={uiStyle.input}
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
              className="form-control shadow-none" 
              placeholder="Enter your password" 
              style={uiStyle.input}
            />
            {errors.password && <small className="text-danger d-block text-start mt-1" style={{fontSize:'0.75rem'}}>{errors.password.message}</small>}
          </div>

          <button style={uiStyle.button} type="submit">
            Sign In
          </button>
        </form>

        <div className='mt-4 text-center'>
          <p style={{ fontSize: '0.9rem', color: '#333' }}>
            <span 
              onClick={() => nav("/SignUp")} 
              style={uiStyle.link}
            >
              Create account
            </span>
          </p>
        </div>
      </div>

     
    </div>
  );
};

export default LoginClient;
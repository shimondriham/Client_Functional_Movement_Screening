import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addEmail, addName } from '../featuers/myDetailsSlice';
import { doApiMethod } from '../services/apiService';
import reactIcon from '../assets/react.svg'; 

function SignUpClient() {
  let nav = useNavigate();
  const dispatch = useDispatch();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch, 
    setError, 
    clearErrors 
  } = useForm();

  const onSubForm = (data) => {
    data.email = data.email.toLowerCase();
    const { ConfirmPassword, ...body } = data;
    doApi(body);
  };

  const doApi = async (_dataBody) => {
    let url = "/users";
    try {
      let resp = await doApiMethod(url, "POST", _dataBody);
      if (resp.data._id) {
        dispatch(addName({ name: _dataBody.fullName }));
        dispatch(addEmail({ email: _dataBody.email }));
        nav("/varification");
      }
    }
    catch (error) {
      console.log(error);
      alert("There was a problem signing up.");
    }
  }

  const password = watch('password');
  const confirmPassword = watch('ConfirmPassword');

  React.useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setError('ConfirmPassword', { type: 'manual', message: 'Passwords do not match' });
    } else {
      clearErrors('ConfirmPassword');
    }
  }, [password, confirmPassword, setError, clearErrors]);

  const toLogin = () => nav("/login");

  // --- Styles ---
  const pageStyle = {
    background: "#f8f9fa",
    height: "100vh",        // גובה קבוע
    overflow: "hidden",     // מניעת גלילה
    position: "relative"
  };

  const waveStyle = {
    position: "absolute",
    bottom: "-20%",
    right: "-10%",
    width: "120%",
    height: "70%",
    background: "linear-gradient(135deg, #7b68ee 0%, #ec4899 100%)",
    borderRadius: "100% 0 0 0 / 80% 0 0 0",
    zIndex: 0
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={pageStyle}>
      
      {/* Background Graphic */}
      <div style={waveStyle}></div>

      {/* Card Container - Compact Version */}
      <div className="card shadow-lg border-0 p-4" style={{ width: '100%', maxWidth: '450px', borderRadius: '16px', zIndex: 1, backgroundColor: 'white' }}>
        
        {/* Header Compact */}
        <div className="text-center mb-3">
            <img src={reactIcon} alt="Logo" style={{ width: '40px', marginBottom: '5px' }} />
            <h3 className="fw-bold mb-0" style={{ color: '#333' }}>Get Started</h3>
            <p className="text-muted small m-0">Free for ever. No credit card needed.</p>
        </div>

        <form onSubmit={handleSubmit(onSubForm)}>

          {/* Full Name */}
          <div className="mb-2">
            <input 
              {...register("fullName", { required: true, minLength: 2, maxLength: 20 })} 
              type="text" 
              className="form-control form-control-sm bg-light border-0 py-2" 
              placeholder="Full Name" 
            />
            {errors.fullName && <small className='text-danger d-block' style={{fontSize:'0.75rem'}}>* Name must be 2-20 chars</small>}
          </div>

          {/* Email */}
          <div className="mb-2">
            <input 
              {...register("email", {
                required: true,
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
              })} 
              type="email" 
              className="form-control form-control-sm bg-light border-0 py-2" 
              placeholder="Work Email" 
            />
            {errors.email && <small className='text-danger d-block' style={{fontSize:'0.75rem'}}>* Invalid email address</small>}
          </div>

          {/* Password */}
          <div className="mb-2">
            <input 
              {...register("password", { required: true, minLength: 4, maxLength: 20 })} 
              type="password" 
              className="form-control form-control-sm bg-light border-0 py-2" 
              placeholder="Password" 
            />
            {errors.password && <small className='text-danger d-block' style={{fontSize:'0.75rem'}}>* Min 4 chars required</small>}
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <input 
              {...register("ConfirmPassword", { required: true })} 
              type="password" 
              className="form-control form-control-sm bg-light border-0 py-2" 
              placeholder="Confirm Password" 
            />
            {errors.ConfirmPassword && <small className='text-danger d-block' style={{fontSize:'0.75rem'}}>* {errors.ConfirmPassword.message}</small>}
          </div>

          {/* Submit Button */}
          <button 
            className="btn btn-primary w-100 py-2 fw-bold shadow-sm" 
            type="submit" 
            disabled={!!errors.ConfirmPassword || !password || !confirmPassword}
            style={{ background: '#7b68ee', border: 'none' }}
          >
            Sign Up
          </button>

        </form>

        {/* Footer Link */}
        <div className="text-center mt-3">
          <span className="text-muted small">Already have an account? </span>
          <span onClick={toLogin} className="text-primary fw-bold small" style={{ cursor: 'pointer' }}>
            Sign In
          </span>
        </div>

      </div>
    </div>
  );
};

export default SignUpClient;
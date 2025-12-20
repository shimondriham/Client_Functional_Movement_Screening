import React from 'react';
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addEmail, addIfShowNav, addName } from '../featuers/myDetailsSlice';
import { doApiMethod } from '../services/apiService';
import { saveTokenLocal } from '../services/localService';
import reactIcon from '../assets/react.svg';

const LoginClient = () => {
  let nav = useNavigate();
  let { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();

  const onSubForm = (data) => {
    data.email = data.email.toLowerCase();
    doApi(data);
  }

  const doApi = async (_dataBody) => {
    let url = "/users/login";
    try {
      let resp = await doApiMethod(url, "POST", _dataBody);
      if (resp.data.token) {
        saveTokenLocal(resp.data.token);
        dispatch(addName({ name: _dataBody.fullName }));
        dispatch(addEmail({ email: _dataBody.email }));
        dispatch(addIfShowNav({ ifShowNav: true }));
        nav("/dashboard");
      }
    }
    catch (error) {
      console.log(error.response?.data?.error);
      alert("Something went wrong, please try again.");
    }
  }

  let emailRef = register("email", {
    required: true,
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  });

  let passwordRef = register("password", { required: true, minLength: 3 });

  const toSignUp = () => nav("/SignUp");

  // --- Styles to mimic ClickUp Background ---
  const pageStyle = {
    background: "#f8f9fa", // Light gray background
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden"
  };

  const waveStyle = {
    position: "absolute",
    bottom: "-20%",
    right: "-10%",
    width: "120%",
    height: "70%",
    background: "linear-gradient(135deg, #7b68ee 0%, #ec4899 100%)", // Purple to Pink gradient
    borderRadius: "100% 0 0 0 / 80% 0 0 0", // Creates the wave curve
    zIndex: 0
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={pageStyle}>

      {/* Background Graphic */}
      <div style={waveStyle}></div>

      {/* Login Card */}
      <div className="card shadow-lg border-0 p-4 p-md-5" style={{ width: '100%', maxWidth: '450px', borderRadius: '20px', zIndex: 1, backgroundColor: 'white' }}>

        <div className="text-center mb-4">
          <img src={reactIcon} alt="Logo" style={{ width: '50px', marginBottom: '15px' }} />
          <h2 className="fw-bold" style={{ color: '#333' }}>Welcome back!</h2>
          <p className="text-muted small">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit(onSubForm)}>

          {/* Email Input */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Email</label>
            <input
              {...emailRef}
              type="email"
              className="form-control bg-light border-0 py-2"
            // placeholder="name@example.com" 
            />
            {errors.email && <small className='text-danger d-block mt-1'>* Email is invalid</small>}
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <div className="d-flex justify-content-between">
              <label className="form-label small fw-bold text-secondary">Password</label>
              <span className="small text-primary" style={{ cursor: 'pointer' }}>Forgot?</span>
            </div>
            <input
              {...passwordRef}
              type="password"
              className="form-control bg-light border-0 py-2"
            // placeholder="••••••••" 
            />
            {errors.password && <small className='text-danger d-block mt-1'>* Min 3 chars required</small>}
          </div>

          {/* Submit Button */}
          <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm" style={{ background: '#7b68ee', border: 'none' }}>
            Sign In
          </button>

        </form>

        {/* Footer Link */}
        <div className="text-center mt-4">
          <span className="text-muted small">Don't have an account? </span>
          <span onClick={toSignUp} className="text-primary fw-bold small" style={{ cursor: 'pointer' }}>
            Sign up
          </span>
        </div>

      </div>
    </div>
  );
};

export default LoginClient;
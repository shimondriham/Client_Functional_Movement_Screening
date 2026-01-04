import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addEmail, addName } from '../featuers/myDetailsSlice';
import { doApiMethod } from '../services/apiService';
import thisIcon from '../assets/icon.png';

function SignUpClient() {
  let nav = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, watch, setError, clearErrors } = useForm();

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
    } catch (error) {
      console.log(error);
    }
  };

  let fullNameRef = register("fullName", { required: true, minLength: 2, maxLength: 20 });
  let emailRef = register("email", {
    required: true,
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  });
  let passwordRef = register("password", { required: true, minLength: 8 });
  let ConfirmPasswordRef = register("ConfirmPassword", { required: true });

  const password = watch('password');
  const confirmPassword = watch('ConfirmPassword');

  React.useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setError('ConfirmPassword', { type: 'manual', message: 'Passwords do not match' });
    } else {
      clearErrors('ConfirmPassword');
    }
  }, [password, confirmPassword, setError, clearErrors]);

  // סגנונות עיצוב לפי התמונה
  const styles = {
    container: {
      fontFamily: "'Inter', sans-serif",
      maxWidth: '450px',
      margin: '80px auto',
      textAlign: 'center',
    },
    header: {
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '8px'
    },
    brandItalic: {
      fontFamily: "'Playwrite IS', cursive", // פונט כתב יד דומה
      fontStyle: 'italic',
      fontWeight: '400'
    },
    subHeader: {
      color: '#666',
      fontSize: '14px',
      marginBottom: '32px'
    },
    label: {
      display: 'block',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px',
      marginLeft: '4px'
    },
    input: {
      backgroundColor: '#F7F7F7',
      border: 'none',
      borderRadius: '12px',
      padding: '14px 20px',
      marginBottom: '4px',
      fontSize: '15px'
    },
    button: {
      backgroundColor: '#F2743E',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      padding: '12px 0',
      fontSize: '16px',
      fontWeight: '600',
      width: '100%',
      marginTop: '20px',
      cursor: 'pointer'
    },
    footerLink: {
      color: '#F2743E',
      textDecoration: 'none',
      fontWeight: '600',
      cursor: 'pointer'
    },
    errorText: {
      fontSize: '12px',
      color: '#dc3545',
      display: 'block',
      textAlign: 'left',
      marginBottom: '10px',
      marginLeft: '4px'
    }
  };

  return (
    <div style={styles.container}>
      {/* לוגו צדדי קטן בפינה (אופציונלי להוסיף כאן) */}
      
      <h1 style={styles.header}>
        Create your <span style={styles.brandItalic}>Fitwave.ai</span> account
      </h1>
      <p style={styles.subHeader}>Start your journey to your vitality</p>

      <form onSubmit={handleSubmit(onSubForm)}>
        
        <div className="mb-3">
          <label style={styles.label}>Full Name*</label>
          <input {...fullNameRef} type="text" style={styles.input} className="form-control" placeholder="Enter your full name" />
          {errors.fullName && <small style={styles.errorText}>Please enter a valid name (2-20 chars)</small>}
        </div>

        <div className="mb-3">
          <label style={styles.label}>Email*</label>
          <input {...emailRef} type="email" style={styles.input} className="form-control" placeholder="Enter your email" />
          {errors.email && <small style={styles.errorText}>Invalid email address</small>}
        </div>

        <div className="mb-3">
          <label style={styles.label}>Password*</label>
          <input {...passwordRef} type="password" style={styles.input} className="form-control" placeholder="Create a password" />
          <small style={{...styles.subHeader, textAlign: 'left', display: 'block', marginTop: '4px', marginLeft: '4px'}}>
            Must be at least 8 characters.
          </small>
          {errors.password && <small style={styles.errorText}>Password is too short</small>}
        </div>

        <div className="mb-3">
          <label style={styles.label}>Confirm Password*</label>
          <input {...ConfirmPasswordRef} type="password" style={styles.input} className="form-control" placeholder="Confirm your password" />
          {errors.ConfirmPassword && <small style={styles.errorText}>{errors.ConfirmPassword.message || "Required field"}</small>}
        </div>

        <button 
          style={{...styles.button, opacity: (!!errors.ConfirmPassword || !password) ? 0.7 : 1}} 
          type="submit"
          disabled={!!errors.ConfirmPassword || !password}
        >
          Create account
        </button>
      </form>

      <div style={{ marginTop: '30px', fontSize: '14px' }}>
        Already have an account? <span onClick={() => nav("/login")} style={styles.footerLink}>Log in</span>
      </div>

    </div>
  );
}

export default SignUpClient;
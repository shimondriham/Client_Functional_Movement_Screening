import React from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addEmail, addName } from '../featuers/myDetailsSlice';
import {  doApiMethod } from '../services/apiService';


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
    console.log(_dataBody);
    let url =  "/users";
    try {
      let resp = await doApiMethod(url, "POST", _dataBody);
      if (resp.data._id) {
        dispatch(addName({ name: _dataBody.fullName }));
        dispatch(addEmail({ email: _dataBody.email }));
        console.log("You sign up");
        nav("/varification");
      }
      console.log(resp.data.error);
      
    }
    catch (error) {
      console.log(error);
    }
  }

  let fullNameRef = register("fullName", { required: true, minLength: 2, maxLength: 20 });
  let emailRef = register("email", {
    required: true,
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  });
  let passwordRef = register("password", { required: true, minLength: 4, maxLength: 20 });
  let ConfirmPasswordRef = register("ConfirmPassword", { required: true });

  // watch password fields to validate match
  const password = watch('password');
  const confirmPassword = watch('ConfirmPassword');

  React.useEffect(() => {
    // only show mismatch after user has typed in confirmPassword
    if (confirmPassword && password !== confirmPassword) {
      setError('ConfirmPassword', { type: 'manual', message: 'Passwords do not match' });
    }
    else {
      clearErrors('ConfirmPassword');
    }
  }, [password, confirmPassword, setError, clearErrors]);

  const toLogin = () => {
    nav("/login");
  };

  return (
    <>
      <div className=" container mt-5 shadow-lg p-4 d-flex flex-column text-center" style={{ width: '80%', maxWidth: '500px', backgroundColor: 'white' }}>
        <div className="row justify-content-center">
          <h3 className='m-2'>Create Account</h3>

          <form onSubmit={handleSubmit(onSubForm)} className="text-center">

            <div className="m-2 flex-grow-1 text-start">
              <input {...fullNameRef} type="text" className="form-control" placeholder="Full Name" style={{ fontSize: '1rem' }} />
              {errors.FullName ? <small className='text-danger '>Enter valid Full Name, min 2 chars max 20</small> : ""}
            </div>

            <div className="m-2 flex-grow-1 text-start">
              <input {...emailRef} type="email" className="form-control" placeholder="Enter email" style={{ fontSize: '1rem' }} />
              {errors.email ? <small className='text-danger '>* Email invalid</small> : ""}
            </div>

            <div className="m-2 flex-grow-1 text-start">
              <input {...passwordRef} type="Password" className="form-control" placeholder="Password" style={{ fontSize: '1rem' }} />
              {errors.password ? <small className='text-danger'>* Enter valid password, min 3 chars</small> : ""}
            </div>

            <div className="m-2 flex-grow-1 text-start">
              <input {...ConfirmPasswordRef} type="Password" className="form-control" placeholder="Confirm Password" style={{ fontSize: '1rem' }} />
              {errors.ConfirmPassword ? <small className='text-danger'>{errors.ConfirmPassword.message }</small> : ""}
            </div>

            <div className='m-2 text-center'>
              <button className="btn btn-primary btn-lg w-75" type="submit" disabled={!!errors.ConfirmPassword || !password || !confirmPassword}>Sign Up</button>
            </div>

          </form>

          <div className='m-2 text-center'>
            <p>You already have an account?</p>
            <p onClick={toLogin} className='text-info'>Sign in</p>
          </div>

        </div>
      </div>
    </>
  );
};

export default SignUpClient
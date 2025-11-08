import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {  doApiMethod } from '../services/apiService';
import reactIcon from '../assets/react.svg';

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
    let url =  "/users/verification";
    try {
      let resp = await doApiMethod(url, "PATCH", _dataBody);
      console.log(resp);
      if (resp.data.status = 200) {
        console.log("You are now a valid user");
        nav("/login");
      }
    }
    catch (error) {
      console.log(error.response.data);
    }
  }

  // const sendAgain = () => {
  //   nav("/SignUp");
  // };

  return (

    <>
      <div className=" container mt-5 shadow-lg p-4 d-flex flex-column text-center" style={{ width: '80%', maxWidth: '500px', backgroundColor: 'white' }}>
        <div className="row justify-content-center">
         <img src={reactIcon} alt="React" style={{ width: '64px', height: '64px' }} />
          <h1 className=''>password verification</h1>

          <p className="text-center mb-4 mt-2">Enter the 5-digit security code we send to : <strong>{myEmail}</strong></p>

          <div className="d-flex justify-content-center gap-2">
            {code.map((value, index) => (
              <input
                key={index}
                id={`input-${index}`}
                type="text"
                className="form-control text-center"
                style={{ width: '50px', fontSize: '24px' }}
                maxLength="1"
                value={value}
                onChange={(event) => handleChange(event, index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              />
            ))}
          </div>

          <div className="text-center mt-3">
            <button
              className="btn btn-primary w-100"
              onClick={handleSubmit} disabled={!isCodeComplete}
            >Send</button>
          </div>
          {/* <p onClick={sendAgain} className='mt-2 text-danger '>Didn't get a code?</p> */}
        </div>
      </div>
    </>
  );
}

export default Varification

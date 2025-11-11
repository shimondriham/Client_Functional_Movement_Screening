import React from 'react'
import { useNavigate } from 'react-router-dom';
import { addIfShowNav } from '../featuers/myDetailsSlice';
import { useDispatch, useSelector } from 'react-redux';

function HeaderClient() {
  let nav = useNavigate()
  const dispatch = useDispatch();
  const IfShowNav = useSelector(state => state.myDetailsSlice.ifShowNav);
  const IsAdmin = useSelector(state => state.myDetailsSlice.isAdmin);

  const onWelcomeClick = () => {
    nav("/");
  }
  const onHomeClick = () => {
    nav("/homeClient");
  }
  const onSignUpClick = () => {
    nav("/signup");
  }
  const onVarifictionClick = () => {
    nav("/varification");
  }
  const onloginClick = () => {
    nav("/login");
  }
  const onlogout = () => {
    dispatch(addIfShowNav({ ifShowNav: false }));
    nav("/logout");
  }
  const onAdminClick = () => {
    nav("/Admin");
  }
  const onMedicalIntakeFormClick = () => {
    nav("/medicalIntakeForm");
  }
  const onDashboardClick = () => {
    nav("/dashboard");
  }
  const onGameListClick = () => {
    nav("/gameList");
  }
  const onInstructionsClick = () => {
    nav("/instructions");
  }
  const onCameraCalibrationClick = () => {
    nav("/cameraCalibration");
  }
  const onGameClick = () => {
    nav("/game");
  }
  const onPracticeListClick = () => {
    nav("/practiceList");
  }
  const onPracticeClick = () => {
    nav("/practice");
  }
  const onPerformanceAnalysisClick = () => {
    nav("/performanceAnalysis");
  }




  return (
  <div className='p-2'>
      <div className='d-flex flex-wrap justify-content-center'>
        {/* before login */}
        {IfShowNav ? " " :
          <button className='btn btn-info border-black px-1 m-1' onClick={onWelcomeClick}>Welcom</button>
        }
        {IfShowNav ? " " :
          <button className='btn btn-info border-black px-1 m-1' onClick={onSignUpClick}>Sign Up</button>
        }
        {IfShowNav ? " " :
          <button className='btn btn-info border-black px-1 m-1' onClick={onVarifictionClick}>varifiction</button>
        }
        {IfShowNav ? " " :
          <button className='btn btn-info border-black px-1 m-1' onClick={onloginClick}>Login</button>
        }

        {/* after login */}
        {IfShowNav ?
          <button className='btn btn-info border-black px-1 m-1' onClick={onHomeClick}>Home</button>
          : ""}
        {IfShowNav ?
          <button className='btn btn-info border-black px-1 m-1' onClick={onMedicalIntakeFormClick}>medicalIntakeForm</button>
          : ""}
        {IfShowNav ?
          <button className='btn btn-info border-black px-1 m-1' onClick={onDashboardClick}>dashboard</button>
          : ""}
        {IfShowNav ?
          <button className='btn btn-info border-black px-1 m-1' onClick={onGameListClick}>gameList</button>
          : ""}
        {IfShowNav ?
          <button className='btn btn-info border-black px-1 m-1' onClick={onInstructionsClick}>instructions</button>
          : ""}
        {IfShowNav ?
          <button className='btn btn-info border-black px-1 m-1' onClick={onCameraCalibrationClick}>cameraCalibration</button>
          : ""}
        {IfShowNav ?
          <button className='btn btn-info border-black px-1 m-1' onClick={onGameClick}>game</button>
          : ""}
        {IfShowNav ?
          <button className='btn btn-info border-black px-1 m-1' onClick={onPracticeListClick}>practiceList</button>
          : ""}
        {IfShowNav ?
          <button className='btn btn-info border-black px-1 m-1' onClick={onPracticeClick}>practice</button>
          : ""}
        {IfShowNav ?
          <button className='btn btn-info border-black px-1 m-1' onClick={onPerformanceAnalysisClick}>performanceAnalysis</button>
          : ""}
        {IfShowNav ?
          <button className='btn btn-info border-black px-1 m-1' onClick={onlogout}>logout</button>
          : ""}
        {IfShowNav && IsAdmin ?
          <button className='btn btn-info border-black px-1 m-1' onClick={onAdminClick}>Admin</button>
          : ""}

      </div>
    </div>
  )
}

export default HeaderClient
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




  return (
    <div className='p-2 container ' style={{ width: "30em" }}>
      <div className='d-flex justify-content-between '>

        {IfShowNav ? " " :
          <button className='btn btn-info border-black ' onClick={onWelcomeClick}>Welcom</button>
        }
        {IfShowNav ? " " :
          <button className='btn btn-info border-black ' onClick={onSignUpClick}>Sign Up</button>
        }
        {IfShowNav ? " " :
          <button className='btn btn-info border-black ' onClick={onVarifictionClick}>varifiction</button>
        }
        {IfShowNav ? " " :
          <button className='btn btn-info border-black ' onClick={onloginClick}>Login</button>
        }
        {IfShowNav ?
          <button className='btn btn-info border-black ' onClick={onHomeClick}>Home</button>
          : ""}
        {IfShowNav ?
          <button className='btn btn-info border-black' onClick={onlogout}>logout</button>
          : ""}
        {IfShowNav && IsAdmin ?
          <button className='btn btn-info border-black' onClick={onAdminClick}>Admin</button>
          : ""}

      </div>
    </div>
  )
}

export default HeaderClient
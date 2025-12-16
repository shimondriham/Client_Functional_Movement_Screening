import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { addIfShowNav } from "../featuers/myDetailsSlice";

const Welcome = () => {
    let nav = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(addIfShowNav({ ifShowNav: false }));
    }, []);
    
    const toSignIn = () => {
        nav("/login");
    };
    const toSignUp = () => {
        nav("/SignUp");
    };

    return (
        <div className="container-fluid mt-5">
               <div className="d-flex justify-content-around p-5 m-3" style={{ height: '350px' }}>
                <div className="text-center p-3" style={{ height: '100%', width: "40%"}}>
                    <div className="m-3"> <img style={{ height: '10%', width: "10%", borderRadius:"50px"}} src="src/assets/react.svg" alt="logo" /></div>
                    <button onClick={toSignIn} className="btn btn-outline-primary m-3 w-50">Sign In</button>
                    <button onClick={toSignUp} className="btn btn-outline-primary m-3 w-50">Sign Up</button>
                </div>

                <div className="px-4" style={{ height: '100%', width: "60%" }}>
                    <div className="bg-white p-4 shadow-lg text-center" style={{ height: '100%', width: "80%", borderRadius: '16px' }}>
                        <h3 className="py-2">About Us</h3>
                        <p>Welcome to FIT WAVE, where innovation meets emotion, and movement becomes play.

At FIT WAVE, we believe that the path to recovery and rehabilitation can and should be positive, empowering, and captivating. The company was born from a single vision: to harness the infectious power of games and the benefits of motion technology, to create a world where every step in the rehabilitation process is a step forward – both in mind and body.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;

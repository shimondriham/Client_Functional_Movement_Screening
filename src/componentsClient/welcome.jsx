import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { addIfShowNav } from "../featuers/myDetailsSlice";

// ייבוא הלוגו כ-PNG
import Logo from '../assets/logo.png'; 

const Welcome = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(addIfShowNav({ ifShowNav: false }));
    }, [dispatch]);
    
    const toSignIn = () => nav("/login");
    const toSignUp = () => nav("/SignUp");

    return (
        <div className="welcome-container">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=OOOH+Baby&display=swap');
            `}</style>
            
            <div className="welcome-hero">
                <div className="hero-content">
                    <div className="logo-section">
                        {/* הלוגו יושב עכשיו ישירות על ה-Hero ללא רקע לבן */}
                        <img 
                            src={Logo} 
                            alt="Fitwave.ai Logo" 
                            className="hero-logo-img" 
                        />
                        <p className="logo-subtitle">Waves of Rehabilitation. Waves of Enjoyment.</p>
                    </div>
                    
                    <h2 className="hero-title">
                        Where Innovation Meets Emotion,
                        <span className="highlight"> and Movement Becomes Play</span>
                    </h2>
                    
                    <p className="hero-subtitle">
                        Transform your rehabilitation journey through interactive motion-based games. 
                        Healing both body and mind in every step.
                    </p>
                    
                    <div className="hero-buttons">
                        <button onClick={toSignIn} className="btn-hero btn-login">Sign In</button>
                        <button onClick={toSignUp} className="btn-hero btn-signup">Get Started Free</button>
                    </div>
                </div>
            </div>

            <div className="about-section">
                <div className="about-card">
                    <h3 className="about-title">About Our Mission</h3>
                    <p className="about-lead">Welcome to FITWAVE.AI, where movement meets play.</p>
                    <p className="about-text">
                        At FIT WAVE, we believe that the path to recovery and rehabilitation can and should be 
                        <span className="text-emphasis"> positive, empowering, and captivating</span>. 
                        Our platform harnesses the infectious power of games and advanced motion technology 
                        to ensure every step in your recovery is a leap forward.
                    </p>
                </div>
            </div>

            <style jsx>{`
                :root {
                    --primary-orange: #F2743E;
                    --dark-text: #1A1A1A;
                    --white: #FFFFFF;
                    --shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }

                .welcome-container {
                    font-family: 'Inter', sans-serif;
                    min-height: 100vh;
                }

                .welcome-hero {
                    background: linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.55)), url('src/assets/welcomePhoto.png') no-repeat;
                    background-size: cover;
                    background-position: center;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    color: var(--white);
                    padding: 2rem;
                    text-align: center;
                }

                .hero-content {
                    max-width: 850px;
                    margin: 0 auto;
                }

                .logo-section {
                    margin-bottom: 2rem;
                }

                .hero-logo-img {
                    width: 250px; /* הגדלתי מעט כדי שיהיה נוכח ללא המעטפת הלבנה */
                    height: auto;
                    border-radius: 12px;
                    display: inline-block;
                    /* צל עדין שמפריד את הלוגו מהרקע במידה והוא כהה */
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
                }

                .logo-subtitle {
                    font-size: 1.15rem;
                    opacity: 0.95;
                    font-weight: 500;
                    margin-top: 15px;
                    letter-spacing: 0.5px;
                }

                .hero-title {
                    font-size: 3.2rem;
                    font-weight: 800;
                    line-height: 1.2;
                    margin: 1.5rem 0;
                }

                .highlight {
                    display: block;
                    font-family: 'OOOH Baby', cursive;
                    color: var(--primary-orange);
                    font-size: 3.4rem;
                    margin-top: 10px;
                }

                .hero-subtitle {
                    font-size: 1.2rem;
                    opacity: 0.9;
                    margin: 0 auto 3.5rem;
                    max-width: 650px;
                    line-height: 1.6;
                }

                .hero-buttons {
                    display: flex;
                    gap: 1.5rem;
                    justify-content: center;
                }

                .btn-hero {
                    padding: 1rem 2.5rem;
                    border-radius: 30px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                }

                .btn-login {
                    background: transparent;
                    color: var(--white);
                    border: 2px solid var(--white);
                }

                .btn-login:hover {
                    background: var(--white);
                    color: var(--dark-text);
                }

                .btn-signup {
                    background: var(--primary-orange);
                    color: var(--white);
                }

                .btn-signup:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(242, 116, 62, 0.3);
                }

                .about-section {
                    padding: 80px 20px;
                    background: #F7F7F7;
                }

                .about-card {
                    max-width: 1000px;
                    margin: 0 auto;
                    background: var(--white);
                    border-radius: 32px;
                    padding: 60px 50px;
                    box-shadow: var(--shadow);
                }

                .text-emphasis {
                    color: var(--primary-orange);
                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .hero-title { font-size: 2.2rem; }
                    .highlight { font-size: 2.4rem; }
                    .hero-logo-img { width: 200px; }
                }
            `}</style>
        </div>
    );
}

export default Welcome;
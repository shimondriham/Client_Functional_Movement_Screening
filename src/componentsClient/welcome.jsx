import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { addIfShowNav } from "../featuers/myDetailsSlice";

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
            <div className="welcome-hero">
                <div className="hero-content">
                    <div className="logo-section">
                        <div className="logo-circle">
                            <div className="wave-icon">🏆</div>
                            <h1 className="logo-text">FITWAVE.AI</h1>
                        </div>
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
                    <p className="about-lead">
                        Welcome to FITWAVE.AI, where movement meets play.
                    </p>
                    <p className="about-text">
                        At FIT WAVE, we believe that the path to recovery and rehabilitation can and should be 
                        <span className="text-emphasis"> positive, empowering, and captivating</span>. 
                        Our platform harnesses the infectious power of games and advanced motion technology 
                        to ensure every step in your recovery is a leap forward.
                    </p>
                    
                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon">🎮</div>
                            <h4>True Gamification</h4>
                            <p>Real games designed by experts, not just points on a screen.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🎯</div>
                            <h4>AI Motion Tracking</h4>
                            <p>Advanced computer vision for precise posture analysis.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🧡</div>
                            <h4>Emotional Care</h4>
                            <p>Motivating environments that make therapy feel like fun.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="how-it-works">
                <h3 className="section-title">Step-by-Step Recovery</h3>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h4>Assessment</h4>
                        <p>We tailor a plan to your unique needs and medical status.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h4>Calibration</h4>
                        <p>Easy 10-second setup for your camera and workspace.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h4>Play & Heal</h4>
                        <p>Engage in games that naturally guide your movements.</p>
                    </div>
                </div>
            </div>

            <div className="vision-section">
                <div className="vision-card">
                    <h3 className="vision-title">Our Vision</h3>
                    <blockquote className="vision-quote">
                        "To break down the barriers between therapy and enjoyment. 
                        To create a future where therapeutic technology is so exciting 
                        that it brings the smile back to the recovery process."
                    </blockquote>
                    <p className="vision-author">— The FITWAVE Team</p>
                </div>
            </div>

            <div className="cta-section">
                <h3 className="cta-title">Ready to Start Your Journey?</h3>
                <p className="cta-text">Join thousands of users transforming their vitality today.</p>
                <div className="cta-buttons">
                    <button onClick={toSignUp} className="btn-cta-primary">Start My Journey</button>
                    <button onClick={toSignIn} className="btn-cta-secondary">Sign In</button>
                </div>
            </div>

            <style jsx>{`
                :root {
                    --primary-orange: #F2743E;
                    --dark-text: #1A1A1A;
                    --light-bg: #F7F7F7;
                    --white: #FFFFFF;
                    --gray-text: #666666;
                    --shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                }

                .welcome-container {
                    font-family: 'Inter', -apple-system, sans-serif;
                    min-height: 100vh;
                    background: var(--white);
                }

                .welcome-hero {
                    background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=2000&q=80');
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

                .logo-circle {
                    display: inline-flex;
                    align-items: center;
                    background: var(--white);
                    padding: 0.8rem 1.8rem;
                    border-radius: 50px;
                    margin-bottom: 1.5rem;
                    box-shadow: var(--shadow);
                }

                .wave-icon {
                    font-size: 1.8rem;
                    margin-right: 0.8rem;
                }

                .logo-text {
                    font-size: 1.6rem;
                    font-weight: 800;
                    margin: 0;
                    color: var(--dark-text);
                    letter-spacing: -0.5px;
                }

                .logo-subtitle {
                    font-size: 1.1rem;
                    opacity: 0.95;
                    font-weight: 500;
                }

                .hero-title {
                    font-size: 3.2rem;
                    font-weight: 800;
                    line-height: 1.2;
                    margin: 1.5rem 0;
                }

                .highlight {
                    display: block;
                    font-family: 'cursive';
                    font-style: italic;
                    color: var(--primary-orange);
                    font-weight: 400;
                    margin-top: 10px;
                }

                .hero-subtitle {
                    font-size: 1.2rem;
                    opacity: 0.9;
                    margin: 0 auto 3rem;
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
                    transition: 0.3s;
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
                    box-shadow: 0 10px 20px rgba(242, 116, 62, 0.4);
                }

                .about-section {
                    padding: 80px 20px;
                    background: var(--light-bg);
                }

                .about-card {
                    max-width: 1000px;
                    margin: 0 auto;
                    background: var(--white);
                    border-radius: 32px;
                    padding: 50px;
                    box-shadow: var(--shadow);
                }

                .about-title, .section-title, .cta-title {
                    color: var(--dark-text);
                    font-size: 2.2rem;
                    font-weight: 800;
                    margin-bottom: 20px;
                }

                .about-lead {
                    font-size: 1.3rem;
                    color: var(--primary-orange);
                    font-weight: 700;
                    margin-bottom: 20px;
                }

                .about-text {
                    font-size: 1.1rem;
                    line-height: 1.8;
                    color: var(--gray-text);
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 30px;
                    margin-top: 50px;
                }

                .feature-item {
                    padding: 30px;
                    background: var(--light-bg);
                    border-radius: 20px;
                    transition: 0.3s;
                }

                .feature-item h4 {
                    font-weight: 700;
                    margin: 15px 0 10px;
                }

                .feature-icon { font-size: 2.5rem; }

                .how-it-works {
                    padding: 80px 20px;
                    text-align: center;
                }

                .steps-container {
                    display: flex;
                    justify-content: center;
                    gap: 40px;
                    max-width: 1100px;
                    margin: 50px auto 0;
                    flex-wrap: wrap;
                }

                .step-number {
                    width: 60px;
                    height: 60px;
                    background: var(--primary-orange);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin: 0 auto 20px;
                }

                .vision-section {
                    background: var(--dark-text);
                    color: var(--white);
                    padding: 100px 20px;
                    text-align: center;
                }

                .vision-quote {
                    font-size: 1.8rem;
                    font-style: italic;
                    max-width: 800px;
                    margin: 0 auto 30px;
                    line-height: 1.5;
                }

                .cta-section {
                    padding: 100px 20px;
                    text-align: center;
                }

                .btn-cta-primary {
                    background: var(--primary-orange);
                    color: white;
                    border: none;
                    padding: 15px 40px;
                    border-radius: 40px;
                    font-weight: 700;
                    font-size: 1.2rem;
                    cursor: pointer;
                    margin: 10px;
                }

                .btn-cta-secondary {
                    background: white;
                    color: var(--primary-orange);
                    border: 2px solid var(--primary-orange);
                    padding: 15px 40px;
                    border-radius: 40px;
                    font-weight: 700;
                    font-size: 1.2rem;
                    cursor: pointer;
                    margin: 10px;
                }

                @media (max-width: 768px) {
                    .hero-title { font-size: 2.2rem; }
                    .about-card { padding: 30px; }
                    .hero-buttons { flex-direction: column; align-items: center; }
                }
            `}</style>
        </div>
    );
}

export default Welcome;
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
                            <div className="wave-icon">🌊</div>
                            <h1 className="logo-text">FIT WAVE</h1>
                        </div>
                        <p className="logo-subtitle">Waves of Rehabilitation. Waves of Enjoyment.</p>
                    </div>
                    
                    <h2 className="hero-title">
                        Where Innovation Meets Emotion,
                        <span className="highlight"> and Movement Becomes Play</span>
                    </h2>
                    
                    <p className="hero-subtitle">
                        Transform your rehabilitation journey through interactive motion-based games
                    </p>
                    
                    <div className="hero-buttons">
                        <button onClick={toSignIn} className="btn-hero btn-login">Sign In</button>
                        <button onClick={toSignUp} className="btn-hero btn-signup">Sign Up Free</button>
                    </div>
                </div>
            </div>

            <div className="about-section">
                <div className="about-card">
                    <h3 className="about-title">About Us</h3>
                    <p className="about-lead">
                        Welcome to FIT WAVE, where innovation meets emotion, and movement becomes play.
                    </p>
                    <p className="about-text">
                        At FIT WAVE, we believe that the path to recovery and rehabilitation can and should be 
                        <span className="text-emphasis"> positive, empowering, and captivating</span>. 
                        The company was born from a single vision: to harness the infectious power of games 
                        and the benefits of motion technology, to create a world where every step in the 
                        rehabilitation process is a step forward – both in mind and body.
                    </p>
                    
                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon">🎮</div>
                            <h4>True Gamification</h4>
                            <p>Built-in games, not just points</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">⚡</div>
                            <h4>Motion Technology</h4>
                            <p>Advanced sensors for precise tracking</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">❤️</div>
                            <h4>Emotional Recovery</h4>
                            <p>Healing both body and mind</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="how-it-works">
                <h3 className="section-title">How It Works</h3>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h4>Personal Assessment</h4>
                        <p>Customized rehabilitation plan</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h4>Interactive Games</h4>
                        <p>Engage in motion-based therapy</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h4>Progress Tracking</h4>
                        <p>Monitor improvements in real-time</p>
                    </div>
                </div>
            </div>

            <div className="vision-section">
                <div className="vision-card">
                    <h3 className="vision-title">Our Vision</h3>
                    <blockquote className="vision-quote">
                        "To break down the barriers between therapy and enjoyment. 
                        To create a future where therapeutic technology is so exciting 
                        that it encourages adherence, improves outcomes, and brings 
                        the smile back to the recovery process."
                    </blockquote>
                    <p className="vision-author">— FIT WAVE Vision</p>
                </div>
            </div>

            <div className="cta-section">
                <h3 className="cta-title">Ready to Start Your Journey?</h3>
                <p className="cta-text">Join our community today</p>
                <div className="cta-buttons">
                    <button onClick={toSignUp} className="btn-cta-primary">Start Free Trial</button>
                    <button onClick={toSignIn} className="btn-cta-secondary">Sign In to Continue</button>
                </div>
            </div>

            <style jsx>{`
                :root {
                    --blue: #4A90E2;
                    --teal: #50E3C2;
                    --light: #F0F7FF;
                    --dark: #1A365D;
                    --white: #FFFFFF;
                    --grad: linear-gradient(135deg, #4A90E2, #50E3C2);
                    --grad-dark: linear-gradient(135deg, #1A365D, #2D3748);
                    --grad-hero: linear-gradient(rgba(26, 54, 93, 0.85), rgba(26, 54, 93, 0.7));
                    --shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                    --shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.2);
                }

                .welcome-container {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    min-height: 100vh;
                    background: var(--light);
                }

                .welcome-hero {
                    background: var(--grad-hero), url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
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
                    max-width: 800px;
                    margin: 0 auto;
                    width: 100%;
                }

                .logo-circle {
                    display: inline-flex;
                    align-items: center;
                    background: var(--grad);
                    padding: 1rem 2rem;
                    border-radius: 50px;
                    margin-bottom: 1rem;
                    box-shadow: var(--shadow);
                }

                .wave-icon {
                    font-size: 2.2rem;
                    margin-right: 1rem;
                }

                .logo-text {
                    font-size: 2.2rem;
                    font-weight: 700;
                    margin: 0;
                    color: var(--white);
                }

                .logo-subtitle {
                    font-size: 1.1rem;
                    opacity: 0.9;
                    margin-top: 0.5rem;
                }

                .hero-title {
                    font-size: 2.2rem;
                    font-weight: 600;
                    line-height: 1.3;
                    margin: 1.2rem 0;
                }

                .highlight {
                    display: block;
                    background: var(--grad);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-top: 0.5rem;
                    font-weight: 700;
                }

                .hero-subtitle {
                    font-size: 1.1rem;
                    opacity: 0.9;
                    margin: 0 auto 2.5rem;
                    max-width: 600px;
                    line-height: 1.6;
                }

                .hero-buttons {
                    display: flex;
                    gap: 1.2rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .btn-hero {
                    padding: 0.9rem 2rem;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                    min-width: 160px;
                }

                .btn-login {
                    background: transparent;
                    color: var(--white);
                    border: 2px solid var(--white);
                }

                .btn-login:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                }

                .btn-signup {
                    background: var(--grad);
                    color: var(--white);
                    box-shadow: var(--shadow);
                }

                .btn-signup:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-lg);
                }

                .about-section, .how-it-works, .vision-section, .cta-section {
                    padding: 4rem 2rem;
                }

                .about-section {
                    background: var(--white);
                }

                .about-card {
                    max-width: 1000px;
                    margin: 0 auto;
                    background: var(--white);
                    border-radius: 16px;
                    padding: 2.5rem;
                    box-shadow: var(--shadow);
                    border: 1px solid rgba(74, 144, 226, 0.1);
                }

                .about-title, .section-title, .vision-title, .cta-title {
                    text-align: center;
                    font-size: 2rem;
                    margin-bottom: 1.8rem;
                    font-weight: 700;
                }

                .about-title, .section-title, .cta-title {
                    background: var(--grad);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .about-lead {
                    font-size: 1.2rem;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    color: var(--dark);
                    font-weight: 500;
                }

                .about-text {
                    font-size: 1rem;
                    line-height: 1.7;
                    color: #555;
                    margin-bottom: 2.5rem;
                }

                .text-emphasis {
                    color: var(--blue);
                    font-weight: 600;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 1.8rem;
                    margin-top: 2.5rem;
                }

                .feature-item {
                    text-align: center;
                    padding: 1.8rem;
                    background: var(--light);
                    border-radius: 12px;
                    transition: transform 0.3s ease;
                }

                .feature-item:hover {
                    transform: translateY(-5px);
                }

                .feature-icon {
                    font-size: 2.5rem;
                    margin-bottom: 0.8rem;
                }

                .feature-item h4 {
                    color: var(--dark);
                    margin-bottom: 0.5rem;
                    font-size: 1.1rem;
                    font-weight: 600;
                }

                .feature-item p {
                    color: #666;
                    font-size: 0.9rem;
                    line-height: 1.5;
                }

                .how-it-works {
                    background: var(--light);
                    text-align: center;
                }

                .steps-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2.5rem;
                    max-width: 900px;
                    margin: 0 auto;
                }

                .step {
                    text-align: center;
                    padding: 1.8rem;
                }

                .step-number {
                    width: 50px;
                    height: 50px;
                    background: var(--grad);
                    color: var(--white);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0 auto 1.2rem;
                }

                .step h4 {
                    color: var(--dark);
                    margin-bottom: 0.8rem;
                    font-size: 1.2rem;
                    font-weight: 600;
                }

                .step p {
                    color: #666;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }

                .vision-section {
                    background: var(--grad-dark);
                    color: var(--white);
                }

                .vision-card {
                    max-width: 800px;
                    margin: 0 auto;
                    text-align: center;
                }

                .vision-title {
                    color: var(--white);
                }

                .vision-quote {
                    font-size: 1.3rem;
                    line-height: 1.7;
                    font-style: italic;
                    padding: 1.8rem;
                    border-left: 3px solid var(--teal);
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    margin-bottom: 1.5rem;
                }

                .vision-author {
                    color: var(--teal);
                    font-weight: 600;
                    font-size: 1rem;
                }

                .cta-section {
                    text-align: center;
                    background: var(--white);
                }

                .cta-title {
                    color: var(--dark);
                }

                .cta-text {
                    font-size: 1.1rem;
                    color: #666;
                    margin-bottom: 2.2rem;
                }

                .cta-buttons {
                    display: flex;
                    gap: 1.2rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .btn-cta-primary, .btn-cta-secondary {
                    padding: 0.9rem 2rem;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    min-width: 180px;
                }

                .btn-cta-primary {
                    background: var(--grad);
                    color: var(--white);
                    border: none;
                    box-shadow: var(--shadow);
                }

                .btn-cta-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-lg);
                }

                .btn-cta-secondary {
                    background: transparent;
                    color: var(--blue);
                    border: 2px solid var(--blue);
                }

                .btn-cta-secondary:hover {
                    background: var(--light);
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .hero-title {
                        font-size: 1.8rem;
                    }
                    
                    .hero-subtitle {
                        font-size: 1rem;
                    }
                    
                    .hero-buttons, .cta-buttons {
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .btn-hero, .btn-cta-primary, .btn-cta-secondary {
                        width: 100%;
                        max-width: 280px;
                    }
                    
                    .logo-circle {
                        flex-direction: column;
                        padding: 1.2rem;
                    }
                    
                    .wave-icon {
                        margin-right: 0;
                        margin-bottom: 0.8rem;
                        font-size: 2rem;
                    }
                    
                    .logo-text {
                        font-size: 2rem;
                    }
                    
                    .about-card {
                        padding: 2rem;
                    }
                    
                    .vision-quote {
                        font-size: 1.1rem;
                        padding: 1.5rem;
                    }
                    
                    .about-title, .section-title, .vision-title, .cta-title {
                        font-size: 1.8rem;
                    }
                }

                @media (max-width: 480px) {
                    .welcome-hero {
                        padding: 1.5rem;
                        min-height: 70vh;
                    }
                    
                    .hero-title {
                        font-size: 1.6rem;
                    }
                    
                    .logo-text {
                        font-size: 1.8rem;
                    }
                    
                    .logo-subtitle {
                        font-size: 1rem;
                    }
                    
                    .about-title, .section-title, .vision-title, .cta-title {
                        font-size: 1.6rem;
                    }
                    
                    .features-grid, .steps-container {
                        grid-template-columns: 1fr;
                    }
                    
                    .feature-item, .step {
                        padding: 1.5rem;
                    }
                    
                    .vision-quote {
                        font-size: 1rem;
                        padding: 1.2rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default Welcome;
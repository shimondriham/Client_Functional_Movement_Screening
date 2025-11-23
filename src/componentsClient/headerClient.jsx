import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addIfShowNav } from "../featuers/myDetailsSlice";
import { useDispatch, useSelector } from "react-redux";

function HeaderClient() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const IfShowNav = useSelector((state) => state.myDetailsSlice.ifShowNav);
  const IsAdmin = useSelector((state) => state.myDetailsSlice.isAdmin);

  const [isMenuOpen, setIsMenuOpen] = useState(false); // burger state

  const onWelcomeClick = () => nav("/");
  const onHomeClick = () => nav("/homeClient");
  const onSignUpClick = () => nav("/signup");
  const onVarifictionClick = () => nav("/varification");
  const onloginClick = () => nav("/login");
  const onAdminClick = () => {
    setIsMenuOpen(false);
    nav("/Admin");
  };
  const onMedicalIntakeFormClick = () => {
    setIsMenuOpen(false);
    nav("/medicalIntakeForm");
  };
  const onDashboardClick = () => nav("/dashboard");
  const onGameListClick = () => nav("/gameList");
  const onInstructionsClick = () => nav("/instructions");
  const onCameraCalibrationClick = () => nav("/cameraCalibration");
  const onGameClick = () => nav("/game");
  const onPracticeListClick = () => nav("/practiceList");
  const onPracticeClick = () => nav("/practice");
  const onPerformanceAnalysisClick = () => nav("/performanceAnalysis");

  const onLogout = () => {
    dispatch(addIfShowNav({ ifShowNav: false }));
    setIsMenuOpen(false);
    nav("/logout");
  };

  return (
    <div className="p-2 position-relative">
      <div className="d-flex align-items-center justify-content-between">
        {/* Logo on the left */}
        <div className="header-logo">
          <img
            src="/favicon1.ico"
            alt="Logo"
            style={{ width: "40px", height: "40px", cursor: "pointer" }}
            onClick={onHomeClick}
          />
        </div>

        {/* Navigation buttons in the center */}
        <div className="d-flex flex-wrap justify-content-center flex-grow-1">
          {/* before login */}
          {!IfShowNav && (
            <>
              <button
                className="btn btn-info border-black px-1 m-1"
                onClick={onWelcomeClick}
              >
                Welcom
              </button>
              <button
                className="btn btn-info border-black px-1 m-1"
                onClick={onSignUpClick}
              >
                Sign Up
              </button>
              <button
                className="btn btn-info border-black px-1 m-1"
                onClick={onVarifictionClick}
              >
                varifiction
              </button>
              <button
                className="btn btn-info border-black px-1 m-1"
                onClick={onloginClick}
              >
                Login
              </button>
            </>
          )}

          {/* after login (main nav buttons) */}
          {IfShowNav && (
            <>
              <button
                className="btn btn-info border-black px-1 m-1"
                onClick={onHomeClick}
              >
                Home
              </button>

              <button
                className="btn btn-info border-black px-1 m-1"
                onClick={onDashboardClick}
              >
                dashboard
              </button>
              <button
                className="btn btn-info border-black px-1 m-1"
                onClick={onGameListClick}
              >
                gameList
              </button>
              <button
                className="btn btn-info border-black px-1 m-1"
                onClick={onInstructionsClick}
              >
                instructions
              </button>
              <button
                className="btn btn-info border-black px-1 m-1"
                onClick={onCameraCalibrationClick}
              >
                cameraCalibration
              </button>
              <button
                className="btn btn-info border-black px-1 m-1"
                onClick={onGameClick}
              >
                game
              </button>
              <button
                className="btn btn-info border-black px-1 m-1"
                onClick={onPracticeListClick}
              >
                practiceList
              </button>
              <button
                className="btn btn-info border-black px-1 m-1"
                onClick={onPracticeClick}
              >
                practice
              </button>
              <button
                className="btn btn-info border-black px-1 m-1"
                onClick={onPerformanceAnalysisClick}
              >
                performanceAnalysis
              </button>

              {IsAdmin && (
                <button
                  className="btn btn-info border-black px-1 m-1"
                  onClick={onAdminClick}
                >
                  Admin
                </button>
              )}
            </>
          )}
        </div>

        {/* Burger menu on the right – only after login */}
        {IfShowNav && (
          <div className="burger-menu">
            <button
              type="button"
              className="burger-btn"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span />
              <span />
              <span />
            </button>

            {isMenuOpen && (
              <div className="burger-dropdown">
                <button
                  type="button"
                  className="burger-item"
                  onClick={onAdminClick}
                >
                  Admin
                </button>
                <button
                  type="button"
                  className="burger-item"
                  onClick={onMedicalIntakeFormClick}
                >
                  Medical Intake Form
                </button>
                <button
                  type="button"
                  className="burger-item"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HeaderClient;

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
  const onInstructionsClick = () => nav("/instructions");
  const onCameraCalibrationClick = () => nav("/cameraCalibration");
  const onGameClick = () => nav("/game");
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
          <div className="dropend" style={{ position: "relative" }}>
            <button
              type="button"
              className="btn btn-light border rounded"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
            >
              {/* use three small bars visually via Bootstrap utilities */}
              <span className="d-block">
                <span className="d-block bg-dark rounded mb-1" style={{ width: 18, height: 2 }} />
                <span className="d-block bg-dark rounded mb-1" style={{ width: 18, height: 2 }} />
                <span className="d-block bg-dark rounded" style={{ width: 18, height: 2 }} />
              </span>
            </button>

            <ul
              className={"dropdown-menu py-2 shadow-sm" + (isMenuOpen ? " show" : "")}
              style={{
                minWidth: 220,
                whiteSpace: "normal",
                zIndex: 3000,
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                left: "auto",
                padding: "8px 0",
                borderRadius: 8,
              }}
            >
              {IsAdmin && (
                <li>
                  <button className="dropdown-item" onClick={onAdminClick}>
                    Admin
                  </button>
                </li>
              )}
              <li>
                <button className="dropdown-item" onClick={onMedicalIntakeFormClick}>
                  Medical Intake Form
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={onLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeaderClient;

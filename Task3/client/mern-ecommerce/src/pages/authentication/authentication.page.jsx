import React, { useState } from "react";
import { Modal } from "@mui/material";
import { Close } from "@mui/icons-material";

import SignIn from "../../components/sign-in/sign-in.component";
import SignUp from "../../components/sign-up/sign-up.component";
import LogoImage from "../../utils/Images/Logo.png";
import AuthImage from "../../utils/Images/AuthImage.png";
import "./authentication.styles.css";

const Authentication = ({ openAuth, setOpenAuth }) => {
  const [login, setLogin] = useState(true);
  return (
    <Modal open={openAuth} onClose={() => setOpenAuth(false)}>
      <div className="container">
        <div className="left">
          <img className="logo" src={LogoImage} alt="Logo" />
          <img className="image" src={AuthImage} alt="Auth" />
        </div>
        <div className="right">
          <div className="close-button" onClick={() => setOpenAuth(false)}>
            <Close />
          </div>
          {login ? (
            <>
              <SignIn setOpenAuth={setOpenAuth} />
              <p className="text">
                Don't have an account?{" "}
                <span className="text-button" onClick={() => setLogin(false)}>
                  Sign Up
                </span>
              </p>
            </>
          ) : (
            <>
              <SignUp setOpenAuth={setOpenAuth} />
              <p className="text">
                Already have an account?{" "}
                <span className="text-button" onClick={() => setLogin(true)}>
                  Sign In
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default Authentication;

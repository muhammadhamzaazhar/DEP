import React, { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { UserContext } from "../../UserContext";
import "./login-register.styles.css";

const LoginAndRegister = ({ formType }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    if (!username) {
      setMessage({ text: "Username is required", type: "error" });
      return;
    }
    if (!password) {
      setMessage({ text: "Password is required", type: "error" });
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
        setRedirect(true);
      } else {
        const errorData = await response.json();
        setMessage({
          text: errorData.message || "Login failed",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (!username) {
      setMessage({ text: "Username is required", type: "error" });
      return;
    }
    if (!password) {
      setMessage({ text: "Password is required", type: "error" });
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setMessage({ text: "Registration successful", type: "success" });
      } else {
        const errorData = await response.json();
        setMessage({
          text: errorData.message || "Registration failed",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form
      id="form1"
      onSubmit={formType === "login" ? handleSignIn : handleSignUp}
    >
      <h2 className="text-center">
        {formType === "login"
          ? "Welcome Back! Please Sign In to Continue"
          : "Join Us! Please Sign Up to Continue"}
      </h2>
      <div
        className="container p-3 mx-auto"
        style={{
          maxWidth: "500px",
          background: "rgba(248, 248, 255, 0.8450980392)",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        {message.text && (
          <div
            className={`text-${
              message.type === "error" ? "danger" : "success"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="row mt-2">
          <div className="form-group">
            <label htmlFor="txtusername" className="form-label col-md-4">
              Username:{" "}
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                id="txtusername"
                className="form-control"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="form-group">
            <label htmlFor="txtpassword" className="form-label col-md-4">
              Password:{" "}
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type="password"
                id="txtpassword"
                className="form-control"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row mt-4 mb-2">
          <div className="col-md-12 text-center">
            <button
              type="submit"
              className="btn btn-outline-dark"
              style={{ width: "150px" }}
            >
              {formType === "login" ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>

        <div className="row mt-4 mb-2">
          <div className="col-md-12 d-flex align-items-center justify-content-center">
            <span>
              {formType === "login"
                ? "Don't Have an account? "
                : "Already have an account? "}{" "}
            </span>
            <button
              onClick={() =>
                navigate(
                  formType === "login" ? "/auth/register" : "/auth/login"
                )
              }
              className="btn btn-link ms-2"
              style={{ padding: "0", textDecoration: "none" }}
              type="button"
            >
              {formType === "login" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginAndRegister;

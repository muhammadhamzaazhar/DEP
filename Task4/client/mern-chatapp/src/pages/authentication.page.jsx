import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/input.component";
import Button from "../components/button.component";
import authImage from "../assets/authImage.png";

const Authentication = ({ isSignIn = true }) => {
  const [data, setData] = useState({
    ...(!isSignIn && { fullName: "" }),
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password } = data;

    if (!isSignIn && !fullName) {
      setMessage({ text: "Full Name is required", type: "error" });
      return;
    }
    if (!email) {
      setMessage({ text: "Email is required", type: "error" });
      return;
    }
    if (!password) {
      setMessage({ text: "Password is required", type: "error" });
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/${
        isSignIn ? "login" : "register"
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const resData = await response.json();

    if (response.status === 400) {
      setMessage({ text: resData.message, type: "error" });
    } else if (response.ok) {
      if (isSignIn) {
        localStorage.setItem("user:token", resData.token);
        localStorage.setItem("user:detail", JSON.stringify(resData.user));
        setMessage({ text: "Login successful!", type: "success" });
        navigate("/");
      } else {
        setMessage({
          text: "Registration successful! Please log in.",
          type: "success",
        });
        navigate("/users/signin");
      }
    } else {
      setMessage({ text: "An unexpected error occurred", type: "error" });
    }
  };

  return (
    <div className="grid grid-cols-5 w-full h-screen">
      <div className="col-span-2">
        <img
          src={authImage}
          alt="Auth Background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="col-span-3 flex justify-center items-center">
        <div className="bg-gray-900 w-5/6 h-5/6 shadow-lg rounded-lg flex flex-col justify-center items-center p-10">
          <div className="text-4xl font-extrabold text-gray-200">
            Welcome{isSignIn && " Back"}
          </div>
          <div className="text-xl font-light mb-10 text-gray-400">
            {isSignIn ? "Sign in to explore" : "Sign up to get started"}
          </div>
          <form
            className="flex flex-col items-center w-full"
            onSubmit={handleSubmit}
          >
            {message.text && (
              <div
                className={`mb-4 ${
                  message.type === "error" ? "text-red-500" : "text-green-500"
                }`}
              >
                {message.text}
              </div>
            )}
            {!isSignIn && (
              <Input
                label="Full Name"
                name="fullName"
                placeholder="Enter Full Name"
                className="mb-6"
                value={data.fullName}
                onChange={(e) => {
                  setData({ ...data, fullName: e.target.value });
                  setMessage({ text: "", type: "" });
                }}
              />
            )}
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter Email Address"
              className="mb-6"
              value={data.email}
              onChange={(e) => {
                setData({ ...data, email: e.target.value });
                setMessage({ text: "", type: "" });
              }}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter Password"
              className="mb-6"
              value={data.password}
              onChange={(e) => {
                setData({ ...data, password: e.target.value });
                setMessage({ text: "", type: "" });
              }}
            />
            <Button label={isSignIn ? "Sign In" : "Sign Up"} type="submit" />
          </form>
          <div className="mt-2 text-gray-400">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}
            <span
              className="text-primary cursor-pointer underline ml-2"
              onClick={() =>
                navigate(`/users/${isSignIn ? "signup" : "signin"}`)
              }
            >
              {isSignIn ? "Sign Up" : "Sign In"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;

import React, { useState } from "react";
import { useDispatch } from "react-redux";

import TextInput from "../text-input/text-input.component";
import Button from "../button/button.component";
import { UserSignIn } from "../../api";
import { loginSuccess } from "../../redux/reducers/userSlice";
import { openSnackbar } from "../../redux/reducers/snackbarSlice";
import "./sign-in.styles.css";

const SignIn = () => {
  const dispatch = useDispatch();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateInputs = () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return false;
    }
    return true;
  };

  const handelSignIn = async () => {
    setButtonLoading(true);
    setButtonDisabled(true);
    if (validateInputs()) {
      await UserSignIn({ email, password })
        .then((res) => {
          dispatch(loginSuccess(res.data));
          dispatch(
            openSnackbar({
              message: "Login Successful",
              severity: "success",
            })
          );
        })
        .catch((err) => {
          if (err.response) {
            setButtonLoading(false);
            setButtonDisabled(false);
            alert(err.response.data.message);
            dispatch(
              openSnackbar({
                message: err.response.data.message,
                severity: "error",
              })
            );
          } else {
            setButtonLoading(false);
            setButtonDisabled(false);
            dispatch(
              openSnackbar({
                message: err.message,
                severity: "error",
              })
            );
          }
        });
    }
    setButtonDisabled(false);
    setButtonLoading(false);
  };

  return (
    <div className="container">
      <div>
        <div className="title">Welcome to Krist 👋</div>
        <div className="span">Please login with your details here</div>
      </div>
      <div className="input-container">
        <TextInput
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          handelChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          password
          value={password}
          handelChange={(e) => setPassword(e.target.value)}
        />
        <div className="text-button">Forgot Password?</div>
        <Button
          text="Sign In"
          onClick={handelSignIn}
          isLoading={buttonLoading}
          isDisabled={buttonDisabled}
        />
      </div>
    </div>
  );
};

export default SignIn;

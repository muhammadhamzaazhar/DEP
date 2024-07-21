import React from "react";
import { CircularProgress } from "@mui/material";
import "./button.styles.css";

const Button = ({
  text,
  isLoading,
  isDisabled,
  rightIcon,
  leftIcon,
  type,
  onClick,
  flex,
  small,
  outlined,
  full,
}) => {
  let buttonClass = "button";
  buttonClass += type === "secondary" ? " secondary" : " primary";
  buttonClass += isDisabled ? " isDisabled" : "";
  buttonClass += isLoading ? " isLoading" : "";
  buttonClass += flex ? " flex" : "";
  buttonClass += small ? " small" : "";
  buttonClass += outlined ? " outlined" : "";
  buttonClass += full ? " full" : "";

  return (
    <div
      className={buttonClass}
      onClick={() => !isDisabled && !isLoading && onClick()}
    >
      {isLoading && (
        <CircularProgress
          style={{ width: "18px", height: "18px", color: "inherit" }}
        />
      )}
      {leftIcon}
      {text}
      {isLoading && <> . . .</>}
      {rightIcon}
    </div>
  );
};

export default Button;

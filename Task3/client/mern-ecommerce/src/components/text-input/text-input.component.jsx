import React, { useState } from "react";
import { CloseRounded, Visibility, VisibilityOff } from "@mui/icons-material";
import "./text-input.styles.css";

const TextInput = ({
  label,
  placeholder,
  name,
  value,
  error,
  handelChange,
  textArea,
  rows,
  columns,
  chipableInput,
  chipableArray,
  removeChip,
  height,
  small,
  popup,
  password,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={`container ${small ? "small" : ""}`}>
      <label
        className={`label ${small ? "small" : ""} ${popup ? "popup" : ""} ${
          error ? "error" : ""
        }`}
      >
        {label}
      </label>
      <div
        className={`outlined-input ${small ? "small" : ""} ${
          popup ? "popup" : ""
        } ${error ? "error" : ""} ${chipableInput ? "chipable-input" : ""}`}
        style={chipableInput ? { minHeight: height } : {}}
      >
        {chipableInput ? (
          <div className="chip-wrapper">
            {chipableArray.map((chip, index) => (
              <div className="chip" key={index}>
                <span>{chip}</span>
                <CloseRounded
                  sx={{ fontSize: "14px" }}
                  onClick={() => removeChip(name, index)}
                />
              </div>
            ))}
            <input
              className={`input ${small ? "small" : ""} ${
                popup ? "popup" : ""
              }`}
              placeholder={placeholder}
              name={name}
              value={value}
              onChange={(e) => handelChange(e)}
            />
          </div>
        ) : (
          <>
            <input
              className={`input ${small ? "small" : ""} ${
                popup ? "popup" : ""
              }`}
              as={textArea ? "textarea" : "input"}
              name={name}
              rows={rows}
              columns={columns}
              placeholder={placeholder}
              value={value}
              onChange={(e) => handelChange(e)}
              type={password && !showPassword ? "password" : "text"}
            />
            {password && (
              <>
                {showPassword ? (
                  <Visibility onClick={() => setShowPassword(false)} />
                ) : (
                  <VisibilityOff onClick={() => setShowPassword(true)} />
                )}
              </>
            )}
          </>
        )}
      </div>
      {error && (
        <p className={`error ${small ? "small" : ""} ${popup ? "popup" : ""}`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default TextInput;

import React, { useState } from "react";
import styles from "./login.module.css"; // tái dùng css có sẵn

export default function PasswordField({
  name,
  placeholder,
  value,
  onChange,
  compareValue, // dùng để check confirm password
  required = true,
}) {
  const [show, setShow] = useState(false);

  const eyeBtnStyle = {
    position: "absolute",
    right: "12px",          // mắt bên phải
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "inherit",
  };

  const tickStyle = {
    position: "absolute",
    right: "40px",           // tick bên trái
    top: "50%",
    transform: "translateY(-50%)",
    color: "limegreen",
  };

  const inputWrapperStyle = { position: "relative" };

  const isMatch =
    compareValue !== undefined &&
    value.length > 0 &&
    value === compareValue;

  return (
    <div className={styles.input} style={inputWrapperStyle}>
      <input
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />

      {/* nút con mắt */}
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        style={eyeBtnStyle}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? (
          // eye-off
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M12 5c4.97 0 9 4 10 7-1 3-5.03 7-10 7-1.73 0-3.36-.41-4.8-1.15"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        ) : (
          // eye
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        )}
      </button>

      {/* dấu tick nếu match */}
      {isMatch && (
        <span style={tickStyle}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
      )}
    </div>
  );
}

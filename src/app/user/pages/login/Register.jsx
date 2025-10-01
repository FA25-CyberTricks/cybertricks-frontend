import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { useAuth } from "../../../../context/AuthContext";

import Header from "../../layouts/header";
import PasswordField from "./PasswordField";

import "../../../../assets/css/user-global.css";
import styles from "./login.module.css";

export default function Register() {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth(); // lấy setter

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
          returnUrl: "http://localhost:3000/login",
        }),
      });

      const data = await res.json(); // ✅ parse body JSON

      if (!res.ok) {
        // ❌ Trường hợp backend trả lỗi HTTP (400/500)
        toast.error(data.message || "Register failed!");
        return;
      }

      // ✅ Thành công
      console.log("Register success:", data);
      toast.success(data.message || "Register success!");

      setTimeout(() => (window.location.href = "/login"), 1500);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong, please try again!");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // gọi endpoint login google (redirect flow)
      const res = await fetch("/api/auth/google-login", {
        method: "GET",
        credentials: "include", // để cookie refreshToken về FE
      });

      if (!res.ok) {
        toast.error("Google login failed!");
        return;
      }

      const data = await res.json();

      if (data.token) {
        setAccessToken(data.token);
      }
      if (data.user) {
        setUser(data.user);
      }

      toast.success("Google login success!");

      setTimeout(() => {
        navigate(data.returnUrl || "/");
      }, 100);
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Something went wrong, please try again!");
    }
  };

  return (
    <>
      <div className="bg-gradient"></div>
      <Header />

      <main className={`container ${styles.hero}`} style={{ paddingTop: 100 }}>
        <p className={styles.welcome}>Welcome to</p>
        <h1 className={styles["logo-wordmark"]}>CYBERTRICK</h1>

        <form className={styles["login-card"]} onSubmit={handleSubmit}>
          <div className={`${styles.row} ${styles["two-col"]}`}>
            <div className={styles.input}>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
            <div className={styles.input}>
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
          </div>

          <div className={styles.input}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>

          <PasswordField
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <PasswordField
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            compareValue={formData.password}
          />

          <label className={`${styles.checkbox} ${styles.agree}`}>
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              required
            />
            <span>
              I agree with{" "}
              <a href="/" className={`${styles.link} ${styles.light}`}>
                privacy
              </a>{" "}
              and{" "}
              <a href="/" className={`${styles.link} ${styles.light}`}>
                policy
              </a>
            </span>
          </label>

          <button className={`btn ${styles["btn-primary"]}`} type="submit">
            Sign up
          </button>

          <button
            className={styles["btn-google"]}
            type="button"
            onClick={handleGoogleLogin}
          >
            <img
              src="assets/images/google-logo.png"
              alt="Google"
              style={{ width: "40px", height: "40px" }}
            />
            Continue with Google
          </button>

          <p className={styles.signup}>
            Already have account?{" "}
            <a href="/login" className={styles.link}>
              Sign in
            </a>
          </p>
        </form>
      </main>
    </>
  );
}

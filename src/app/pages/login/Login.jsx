// src/components/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../../context/AuthContext";
import Header from "../../layouts/Header";
import PasswordField from "./PasswordField";
import GoogleLoginButton from "./GoogleLoginButton";

import "../../../assets/css/user-global.css";
import styles from "./login.module.css";
import env from "../../config/env.js";

export default function Login() {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();
  const params = new URLSearchParams(window.location.search);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
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

    const BE_ORIGIN = env.BE_ORIGIN;
    try {
      const res = await fetch(`${BE_ORIGIN}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          remember: formData.remember,
          returnUrl: params.get("returnUrl") || "/",
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Login failed!");
        return;
      }

      if (data.token) setAccessToken(data.token);
      if (data.user) setUser(data.user);

      toast.success("Login success!");
      setTimeout(() => navigate(data.returnUrl || "/"), 100);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong, please try again!");
    }
  };

  return (
    <>
      <div className="bg-gradient"></div>
      <Header />

      <main className={`container ${styles.hero}`} style={{ paddingTop: 150 }}>
        <p className={styles.welcome}>Welcome to</p>
        <h1 className={styles["logo-wordmark"]}>CYBERTRICK</h1>

        <form className={styles["login-card"]} onSubmit={handleSubmit}>
          <div className={styles.input}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <PasswordField
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
          />

          <div className={`${styles.row} ${styles.between} meta`}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>
            <a className={`${styles.link} muted`} href="/">
              Forgot password?
            </a>
          </div>

          <button className={`btn ${styles["btn-primary"]}`} type="submit">
            Sign in
          </button>

          {/* ✅ Truyền navigate xuống GoogleLoginButton */}
          <GoogleLoginButton
            className={styles["btn-google"]}
            navigate={navigate}
          />

          <p className={styles.signup}>
            Don&apos;t have account?{" "}
            <a href="/register" className={styles.link}>
              Sign up
            </a>
          </p>
        </form>
      </main>
    </>
  );
}

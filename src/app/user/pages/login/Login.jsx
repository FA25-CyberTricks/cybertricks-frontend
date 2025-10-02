import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { useAuth } from "../../../../context/AuthContext";

import Header from "../../layouts/header";
import PasswordField from "./PasswordField";

import "../../../../assets/css/user-global.css";
import styles from "./login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth(); // lấy setter

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

    try {
      const res = await fetch("/api/auth/login", {
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

      // ✅ Lưu access token vào memory (context)
      if (data.token) {
        setAccessToken(data.token);
      }
      if (data.user) {
        setUser(data.user); // 👈 chỗ này bạn quên
      }

      toast.success("Login success!");

      setTimeout(() => {
        navigate(data.returnUrl || "/");
      }, 100);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong, please try again!");
    }
  };

  const FE_ORIGIN = window.location.origin;
  const BE_ORIGIN = "https://localhost:7229";
  const BE_ORIGIN_ONLY = new URL(BE_ORIGIN).origin;

  const handleGoogleLogin = () => {
    const returnUrl =
      new URLSearchParams(window.location.search).get("returnUrl") || "/";

    const width = 500,
      height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const url =
      `${BE_ORIGIN}/api/auth/google-login` +
      `?returnUrl=${encodeURIComponent(returnUrl)}` +
      `&opener=${encodeURIComponent(FE_ORIGIN)}`;

    const popup = window.open(
      url,
      "googleLogin",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      toast.error("Popup bị chặn. Hãy cho phép popup cho trang này.");
      return;
    }

    function onMessage(e) {
      if (e.origin !== BE_ORIGIN_ONLY) return; // chặn cross-origin
      if (e.source !== popup) return; // chỉ nhận đúng popup

      try {
        const data = e.data;
        if (data && data.token) {
          setAccessToken(data.token);
          if (data.user) setUser(data.user);
          toast.success("Google login success!");
          navigate(data.returnUrl || "/");
        } else if (data && data.error) {
          toast.error("Google login failed: " + data.error);
        }
      } finally {
        window.removeEventListener("message", onMessage);
        if (popup && !popup.closed) popup.close();
      }
    }

    window.addEventListener("message", onMessage, { once: true });

    // Tuỳ chọn: dọn dẹp khi user tự đóng popup
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        window.removeEventListener("message", onMessage);
      }
    }, 500);
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

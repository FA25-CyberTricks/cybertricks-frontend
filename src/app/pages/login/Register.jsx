import React, { useState } from "react";
import { toast } from "react-toastify";

import Header from "../../layouts/Header";
import PasswordField from "./PasswordField";
import GoogleLoginButton from "./GoogleLoginButton";

import "../../../assets/css/user-global.css";
import styles from "./login.module.css";
import env from "../../config/env.js";

export default function Register() {

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

    const FE_ORIGIN = env.FE_ORIGIN;
    const BE_ORIGIN = env.BE_ORIGIN;

    try {
      const res = await fetch(`${BE_ORIGIN}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
          returnUrl: `${FE_ORIGIN}/login`,
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

          <GoogleLoginButton className={styles["btn-google"]} />

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

import React, { useState, useEffect } from "react";
import "../../../assets/css/user-global.css";

export default function Header() {
  // state cho toggle notification
  const [showNotif, setShowNotif] = useState(false);
  // state cho scroll
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // cleanup khi component bị remove
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header  className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="brand">
          <span className="brand-mark">CT</span>
        </div>

        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/">Optional</a>
          <a href="/">FAQ</a>
          <a className="active" href="/">List</a>
          <span className="divider"></span>
        </nav>

        <div className="nav-actions">
          <div className="search">
            <input placeholder="Search" aria-label="Search" />
            <svg className="search-icon" viewBox="0 0 24 24">
              <path
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Button toggle notification */}
          <button
            className="icon-btn"
            onClick={() => setShowNotif(!showNotif)}
          >
            <svg viewBox="0 0 24 24">
              <path
                d="M12 22a2.5 2.5 0 0 0 2.45-2H9.55A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-14 0v5l-2 2v1h18v-1l-2-2Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Notif card */}
          <aside
            className={`notif-card ${showNotif ? "active" : ""}`}
            aria-label="Latest notifications"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <div className="avatar" style={{ width: "46px", height: "46px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 22c1.657 0 3-1.343 3-3H9c0 1.657 1.343 3 3 3Zm7-7v-5a7 7 0 10-14 0v5l-2 2v1h18v-1l-2-2Z"
                    fill="#fff"
                  />
                </svg>
              </div>
              <strong style={{ fontSize: "18px" }}>Notification</strong>
            </div>
            <div className="notif-list">
              <div className="notif-item">You have new voucher from CyberCore - Gaming D.C</div>
              <div className="notif-item">You have new voucher from CyberCore - Gaming D.C</div>
              <div className="notif-item">You have new voucher from CyberCore - Gaming D.C</div>
              <div className="notif-item">You have new voucher from CyberCore - Gaming D.C</div>
            </div>
          </aside>

          <button className="icon-btn">
            <svg viewBox="0 0 24 24">
              <path
                d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

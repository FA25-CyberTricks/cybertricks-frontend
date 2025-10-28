import React, { useState, useEffect, useRef } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HashLink } from "react-router-hash-link";

import "../../assets/css/user-global.css";

export default function Header() {
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerSearch, setHeaderSearch] = useState(""); // 👈 search ở header

  const notifRef = useRef(null);
  const bellBtnRef = useRef(null);
  const userMenuRef = useRef(null); // ref cho menu user
  const { user, setUser, setAccessToken } = useAuth();
  const navigate = useNavigate();

  // hiệu ứng scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // bắt sự kiện click ngoài (cho notif + user menu)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showNotif &&
        notifRef.current &&
        !notifRef.current.contains(e.target) &&
        bellBtnRef.current &&
        !bellBtnRef.current.contains(e.target)
      ) {
        setShowNotif(false);
      }

      if (
        showUserMenu &&
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotif, showUserMenu]);

  // xử lý logout
  const handleLogout = async () => {
    try {
      await fetch("https://localhost:7229/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setAccessToken(null);
      navigate("/login");
    }
  };

  // === Header search handlers ===
  const doHeaderSearch = () => {
    const q = (headerSearch || "").trim();
    // điều hướng sang Browse kèm query param q
    navigate(q.length ? `/browse?q=${encodeURIComponent(q)}` : "/browse");
  };
  const onHeaderSearchKeyDown = (e) => {
    if (e.key === "Enter") doHeaderSearch();
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="brand">
          <a href="/" className="brand-mark">
            <img
              src="/assets/images/cybertrick-logo-03.png"
              alt="logo"
              style={{ width: "40px", height: "30px" }}
            />
          </a>
        </div>

        <nav className="nav-links">
          <HashLink smooth to="/#start">
            Home
          </HashLink>
          <Link to="/browse">Cyber Cafés</Link>
          <HashLink smooth to="/faq">
            FAQ
          </HashLink>
          <HashLink smooth to="/#team">
            Other
          </HashLink>
          <span className="divider"></span>
        </nav>

        <div className="nav-actions">
          {/* Search */}
          <div className="search">
            <input
              placeholder="Search"
              aria-label="Search"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              onKeyDown={onHeaderSearchKeyDown}
            />
            <button
              className="search-icon"
              aria-label="Search"
              onClick={doHeaderSearch}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <svg viewBox="0 0 24 24">
                <path
                  d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Button toggle notification */}
          <button
            className="icon-btn"
            ref={bellBtnRef}
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
            ref={notifRef}
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
              <div className="avatar">
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
              <div className="notif-item">
                You have new voucher from CyberCore - Gaming D.C
              </div>
              <div className="notif-item">
                You have new voucher from CyberCore - Gaming D.C
              </div>
              <div className="notif-item">
                You have new voucher from CyberCore - Gaming D.C
              </div>
              <div className="notif-item">
                You have new voucher from CyberCore - Gaming D.C
              </div>
            </div>
          </aside>

          {user ? (
            <div className="user-menu" ref={userMenuRef}>
              <button
                className="icon-btn"
                style={{
                  padding: 0,
                }}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </button>

              {showUserMenu && (
                <div className="notif-card active dropdown-menu">
                  <div className="">
                    <div className="notif-item">
                      Hi {user.firstName || user.fullName}!
                    </div>
                    <div className="notif-item profile-btn">
                      <Link to="/profile">
                        <User size={18} style={{ marginRight: "8px" }} />
                        Profile
                      </Link>
                    </div>
                    <div className="notif-item profile-btn">
                      <Settings size={18} style={{ marginRight: "8px" }} />
                      Setting
                    </div>
                    <div className="notif-item profile-btn">
                      <button
                        className="notif-item logout-btn"
                        onClick={handleLogout}
                      >
                        <LogOut size={18} style={{ marginRight: "8px" }} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="icon-btn">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

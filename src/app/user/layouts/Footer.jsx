import React from "react";
import "../../../assets/css/user-global.css"; // import css role user

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        
        {/* Brand */}
        <div className="ft-brand">
          <div className="ft-logo">
            <span className="brand-mark">CT</span>
            <span className="wordmark">CYBERTRICK</span>
          </div>
        </div>

        {/* Column: Product */}
        <div className="ft-col">
          <h3>Product</h3>
          <ul>
            <li><a href="/">Book</a></li>
            <li><a href="/">Reporting and analysis</a></li>
            <li><a href="/">Link</a></li>
          </ul>
        </div>

        {/* Column: Source */}
        <div className="ft-col">
          <h3>Source</h3>
          <ul>
            <li><a href="/">Facebook</a></li>
            <li><a href="/">Introduce</a></li>
            <li><a href="/">Help Center</a></li>
            <li><a href="/">Condition</a></li>
            <li><a href="/">License</a></li>
            <li><a href="/">Privacy</a></li>
          </ul>
        </div>

        {/* Column: Information */}
        <div className="ft-col">
          <h3>Information</h3>
          <p>
            Want to know what Cybertrick’s next update is? <br />
            Leave us a message.
          </p>
          <form className="subscribe">
            <input
              type="email"
              placeholder="abcxyz@gmail.com"
              aria-label="Email"
              required
            />
            <button aria-label="Submit">
              <svg viewBox="0 0 24 24">
                <path
                  d="M5 12h13M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}

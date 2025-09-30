import React from "react";
import "./home.css"; // CSS riêng của trang Home (nội dung bạn gửi)
import "../../../../assets/css/user-global.css"; 

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="blob red-left" />
        <div className="blob red-right" />

        <div className="container hero-wrap">
          <div>
            <div className="eyebrow">Welcome to</div>
            <h1 className="title">cybertrick</h1>
            <p className="subtitle">Your Ultimate Gaming Hub !</p>
            <p className="lead">
              Cyber Trick makes it easy for gamers to book seats at cyber cafes
              anytime, anywhere. Browse available gaming spots, select your
              preferred equipment, and reserve with ease. Perfect for solo
              players, teams, and esports enthusiasts looking for a seamless
              gaming experience.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#start">Start Booking</a>
              <a className="btn btn-ghost" href="#more">More</a>
            </div>
          </div>
        </div>
      </section>

      {/* PITCH (light) */}
      <section className="section light" id="list">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="h1">Book Gaming Seats Instantly – Discover Top Cyber</h2>
          <div className="sub">
            <span style={{ color: "var(--brand)" }}>Explore – Book – Enjoy</span>{" "}
            Premium Gaming Experiences
          </div>
          <p style={{ maxWidth: 980, margin: "16px auto 0" }}>
            Looking for a quality cyber café nearby? Want to reserve your seat
            ahead of time to skip the wait? Cybertrick is your go-to platform to
            search, book, and review gaming cafés with ease.
          </p>
        </div>
      </section>

      {/* Two column: Book fast */}
      <section className="section second-section" style={{ position: "relative", overflow: "hidden" }}>
        <div className="container">
          <div className="right">
            <h3 className="h1">
              Book Your Seat in <span className="brand" style={{ color: "var(--brand)" }}> Advance</span> 
              <br />
             No More <span className="brand" style={{ color: "var(--brand)" }}> Waiting</span> 
            </h3>
            <p>
              Book in just 30 seconds. 
              <br />
              Instant confirmation through café management systems. 
              <br />
              Choose your preferred time, area, and setup.
            </p>
          </div>
        </div>
      </section>

      {/* Two column: Find perfect */}
      <section className="section light">
        <div className="container twocol">
          <div>
            <h3 className="h1">
              Find the <span className="brand">Perfect Cyber Cafe</span> for You
            </h3>
            <p>
              Search by location, game type, PC specs, room types (couple rooms,
              private zones, etc.)<br />
              Smart filters: high-end PCs, budget-friendly, nearby, open 24/7,...<br />
              Real images and complete details of each venue
            </p>
          </div>
          <div>
            <div
              style={{
                aspectRatio: "4 / 3",
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,.12)",
                backgroundImage: "url('https://placehold.co/800x600')",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
          </div>
        </div>
            <div className="container twocol">
          <div>
            <div
              style={{
                aspectRatio: "4 / 3",
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid var(--border)",
                backgroundImage: "url('https://placehold.co/800x600')",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
          </div>
              <div className="right">
                <h3 className="h1">
                Real <span className="brand" style={{ color: "var(--brand)" }}> Reviews</span> From
                <br/>
                <span className="brand" style={{ color: "var(--brand)" }}> Real Gamers</span>
                </h3>
                <p>
                Thousands of genuine user reviews. Ratings based on experience,
                service, and pricing. Contribute your feedback to help improve the
                gaming community.
                </p>
            </div>
        </div>
      </section>

      {/* Two column: Reviews */}
      <section className="section third-section">
         <div className="container">
          <h3 className="h1" style={{ textAlign: "center", color: "var(--brand)" }}>
            Why use CyberTrick?
         </h3>
          <div className="features">
            <div className="feature">24/7 Multilingual<br />Support</div>
            <div className="feature">Professional Technical<br />Monitoring</div>
            <div className="feature">Regular Updates</div>
            <div className="feature">Global Presence</div>
          </div>
        </div>
      </section>

      {/* Why use + feature tiles */}
      <section className="section light">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <div className="sub">
              Try{" "}
              <span style={{ fontFamily: "'Cynosure Straight','Orbitron',sans-serif", color: "var(--brand)" }}>
                CYBERTRICK
              </span>{" "}
              now !
            </div>
            <div style={{ marginTop: 18 }}>
              <a className="btn btn-primary" href="#start">Start!</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

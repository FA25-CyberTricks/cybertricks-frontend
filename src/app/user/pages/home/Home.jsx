import Header from "../../layouts/header";
import Footer from "../../layouts/Footer";

import "../../../../assets/css/user-global.css";
import styles from "./home.module.css";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <section className={`${styles.hero} ${styles.section1}`} id="start">
          <div className={`${styles.blob} ${styles["red-left"]}`} />
          <div className={`${styles.blob} ${styles["red-right"]}`} />

          <div className={`container ${styles["hero-wrap"]}`}>
            <div>
              <div className={styles.eyebrow}>Welcome to</div>
              <h1 className={styles.title}>Cybertricks</h1>
              {/* <img 
                  src="assets/images/cybertrick-logo-04.png" 
                  alt="logo" 
                  style={{ width: "400px", height: "60px" ,margin: "10px 0"}}
              /> */}
              <p className={styles.subtitle}>Your Ultimate Gaming Hub !</p>
              <p className="lead">
                Cyber Trick makes it easy for gamers to book seats at cyber
                cafes anytime, anywhere. Browse available gaming spots, select
                your preferred equipment, and reserve with ease. Perfect for
                solo players, teams, and esports enthusiasts looking for a
                seamless gaming experience.
              </p>

              <div className={styles["cta-row"]}>
                <a className={`btn ${styles["btn-primary"]}`} href="#start">
                  Start Booking
                </a>
                <a className={`btn ${styles["btn-ghost"]}`} href="#more">
                  More
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* PITCH (light) */}
        <section className={`${styles.section} ${styles.light}`} id="list">
          <div className="container" style={{ textAlign: "center" }}>
            <h2 className="h1" style={{ fontSize: "48px", margin: "10px 0" }}>
              Book Gaming Seats Instantly – Discover Top Cyber
            </h2>
            <div className={styles.sub}>
              <span style={{ color: "var(--brand)" }}>
                Explore – Book – Enjoy
              </span>{" "}
              Premium Gaming Experiences
            </div>
            <p style={{ maxWidth: 980, margin: "16px auto 0" }}>
              Looking for a quality cyber café nearby? Want to reserve your seat
              ahead of time to skip the wait? Cybertrick is your go-to platform
              to search, book, and review gaming cafés with ease.
            </p>
          </div>
        </section>

        {/* Two column: Book fast */}
        <section
          className={`${styles.section} ${styles.section2}`}
          style={{ position: "relative", overflow: "hidden" }}
          id="more"
        >
          <div className="container">
            <div className={styles.right}>
              <h3 className={styles.h1}>
                Book Your Seat in{" "}
                <span
                  className={`${styles.brand}`}
                  style={{ color: "var(--brand)" }}
                >
                  {" "}
                  Advance
                </span>
                <br />
                No More{" "}
                <span
                  className={`${styles.brand}`}
                  style={{ color: "var(--brand)" }}
                >
                  {" "}
                  Waiting
                </span>
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
        <section
          className={`${styles.section} ${styles.light} ${styles.section3}`}
        >
          <div className={`container ${styles.twocol}`}>
            <div>
              <h3 className={styles.h1}>
                Find the{" "}
                <span className={`${styles.brand}`}>Perfect Cyber Cafe</span>{" "}
                for You
              </h3>
              <p>
                Search by location, game type, PC specs, room types (couple
                rooms, private zones, etc.)
                <br />
                Smart filters: high-end PCs, budget-friendly, nearby, open
                24/7,...
                <br />
                Real images and complete details of each venue
              </p>
            </div>
            <div>
              <div
                style={{
                  aspectRatio: "1 / 1",
                  width: "300px",
                  marginLeft: "auto",
                  backgroundImage: "url('/assets/images/icon-01.png')",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
            </div>
          </div>

          <div className={`container ${styles.twocol}`}>
            <div>
              <div
                style={{
                  aspectRatio: "1 / 1",
                  width: "300px",
                  marginTop: "20px",
                  backgroundImage: "url('/assets/images/icon-02.png')",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
            </div>
            <div className={styles.right}>
              <h3 className={styles.h1}>
                Real{" "}
                <span
                  className={`${styles.brand}`}
                  style={{ color: "var(--brand)" }}
                >
                  {" "}
                  Reviews
                </span>{" "}
                From
                <br />
                <span
                  className={`${styles.brand}`}
                  style={{ color: "var(--brand)" }}
                >
                  {" "}
                  Real Gamers
                </span>
              </h3>
              <p>
                Thousands of genuine user reviews. Ratings based on experience,
                service, and pricing. Contribute your feedback to help improve
                the gaming community.
              </p>
            </div>
          </div>
        </section>

        {/* Why use */}
        <section className={`${styles.section} ${styles.section4}`} id="team">
          <div className="container">
            <h3
              className={styles.h1}
              style={{ textAlign: "center", color: "var(--brand)" }}
            >
              Why use CyberTrick?
            </h3>
            <div className={styles.features}>
              <div className={styles.feature}>
                <div
                  style={{
                    aspectRatio: "1 / 1",
                    width: "150px",
                    backgroundImage: "url('/assets/images/icon-03.png')",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <br />
                24/7 Multilingual
                <br />
                Support
              </div>
              <div className={styles.feature}>
                <div
                  style={{
                    aspectRatio: "1 / 1",
                    width: "150px",
                    backgroundImage: "url('/assets/images/icon-06.png')",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <br />
                Professional Technical
                <br />
                Monitoring
              </div>
              <div className={styles.feature}>
                <div
                  style={{
                    aspectRatio: "1 / 1",
                    width: "150px",
                    backgroundImage: "url('/assets/images/icon-04.png')",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <br />
                Regular Updates
              </div>
              <div className={styles.feature}>
                <div
                  style={{
                    aspectRatio: "1 / 1",
                    width: "150px",
                    backgroundImage: "url('/assets/images/icon-05.png')",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <br />
                Global Presence
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={`${styles.section} ${styles.light}`}>
          <div className="container">
            <div style={{ textAlign: "center" }}>
              <div className={styles.sub} style={{ fontSize: "48px" }}>
                Try{" "}
                <span
                  style={{
                    fontFamily: "'Cynosure Straight','Orbitron',sans-serif",
                    color: "var(--brand)",
                  }}
                >
                  CYBERTRICK
                </span>{" "}
                now !
              </div>
              <div style={{ marginTop: 18 }}>
                <a className={`btn ${styles["btn-primary"]}`} href="#start">
                  Start!
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

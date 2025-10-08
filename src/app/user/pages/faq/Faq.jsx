import React from "react";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

import styles from "./faq.module.css";
import "../../../../assets/css/user-global.css";
export default function FAQ() {
  return (
    <>
      <div className="bg-gradient"></div>
      <Header />
      <main
        className={`${styles.content} container`}
        style={{ paddingTop: "100px" }} id="faq"
      >
        <h1 className={styles["page-title"]}>FAQ</h1>
        <section className={styles.faq}>
          <details className={styles.item}>
            <summary>
              <span>What is Cybertrick?</span>
              <svg
                className={styles.chev}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <div className={styles.answer}>
              CyberTrick is a platform to discover, book and manage gaming seats
              with ease.
            </div>
          </details>

          <details className={styles.item}>
            <summary>
              <span>How do I book a seat on Cybertrick?</span>
              <svg className={styles.chev} viewBox="0 0 24 24">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <div className={styles.answer}>
              Choose your venue, pick a time slot, and confirm your booking.
              You’ll get a confirmation instantly.
            </div>
          </details>

          <details className={styles.item}>
            <summary>
              <span>Can I book for multiple people at once?</span>
              <svg className={styles.chev} viewBox="0 0 24 24">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <div className={styles.answer}>
              Yes. Add seats for your friends in the same reservation and pay in
              one go.
            </div>
          </details>

          <details className={styles.item}>
            <summary>
              <span>Is there a fee to book on Cybertrick?</span>
              <svg className={styles.chev} viewBox="0 0 24 24">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <div className={styles.answer}>
              We don’t charge extra booking fees; pricing comes directly from
              venues.
            </div>
          </details>

          <details className={styles.item}>
            <summary>
              <span>Can I cancel or modify my booking?</span>
              <svg className={styles.chev} viewBox="0 0 24 24">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <div className={styles.answer}>
              You can cancel or change time before the venue’s cutoff; policies
              may vary by location.
            </div>
          </details>
        </section>
      </main>
      <Footer />
    </>
  );
}

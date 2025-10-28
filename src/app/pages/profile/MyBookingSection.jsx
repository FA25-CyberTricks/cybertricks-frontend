// src/pages/Profile/components/MyBookingSection.jsx
import styles from "./profile.module.css";

export default function MyBookingSection() {
  return (
    <section className={styles["booking-card"]}>
      <h2>My booking</h2>
      <div className={styles.ticket}>
        <div className={styles["t-left"]}>
          <h3>CyberCore – Gaming D.C</h3>
          <p>
            Toà nhà Xi Grand Court, 258 Lý Thường Kiệt, Phường 14, Quận 10,
            Hồ Chí Minh City, Vietnam
          </p>
          <div className={styles.details}>
            <div>
              <div>
                <strong>Hour:</strong> 7:00 – 8:00
              </div>
              <div>
                <strong>Floor:</strong> 1
              </div>
              <div>
                <strong>Chair:</strong> 2
              </div>
            </div>
            <div>
              <div>
                <strong>Food:</strong> 2 Mỳ tôm 2 trứng
              </div>
              <div>
                <strong>Drink:</strong> 2 Sting đỏ
              </div>
            </div>
          </div>
        </div>
        <div className={styles["t-right"]}>
          <div className={styles.total}>
            Total : <span>74.000 VND</span>
          </div>
        </div>
      </div>
    </section>
  );
}

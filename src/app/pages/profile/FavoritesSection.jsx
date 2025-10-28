// src/pages/Profile/components/FavoritesSection.jsx
import { Link } from "react-router-dom";
import styles from "./profile.module.css";

export default function FavoritesSection() {
  return (
    <section className={styles.favs}>
      <h2>My favourites:</h2>
      <ul className={styles["fav-list"]}>
        <li>
          <span>• CyberCore – Gaming D.C</span>
          <Link className={`${styles.btn} ${styles.red} ${styles.pill}`} to="/detail/5">
            Visit
          </Link>
        </li>
        <li>
          <span>• CyberCore GIK Town</span>
          <Link className={`${styles.btn} ${styles.red} ${styles.pill}`} to="/detail/6">
            Visit
          </Link>
        </li>
      </ul>
    </section>
  );
}

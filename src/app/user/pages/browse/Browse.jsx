import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

import styles from "./browse.module.css";
import "../../../../assets/css/user-global.css";

// Helpers ----------------------------------------------------
function Stars({ value }) {
  const full = Math.max(0, Math.min(5, value ?? 0));
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? "" : styles.off}>★</span>
      ))}
    </div>
  );
}

function fallbackThumb(idx = 0) {
  return idx % 2 === 0 ? "assets/thumb1.jpg" : "assets/thumb2.jpg";
}

function toKmFromLatitude(lat) {
  if (lat == null) return "~ 0 km";
  const v = Number(lat);
  if (Number.isNaN(v)) return "~ 0 km";
  return `~ ${v.toFixed(1)} km`;
}

// Chuẩn hóa key cho an toàn (BE PascalCase/camelCase) --------
function normalizeDto(dto) {
  return {
    storeId: dto?.storeId ?? dto?.StoreId,
    brandId: dto?.brandId ?? dto?.BrandId,
    name: dto?.name ?? dto?.Name,
    address: dto?.address ?? dto?.Address,
    contactPhone: dto?.contactPhone ?? dto?.ContactPhone,
    latitude: dto?.latitude ?? dto?.Latitude,
    visited: dto?.visited ?? dto?.Visited,
    avatar: dto?.avatar ?? dto?.Avatar ?? null,
  };
}

// Map StoreDto -> UI item cho template ------------------------
function mapStoreDtoToCard(dto, idx) {
  return {
    id: dto.storeId ?? idx + 1,
    img: dto.avatar && String(dto.avatar).trim() ? dto.avatar : fallbackThumb(idx),
    name: dto.name ?? "Unnamed Store",
    status: "is-online",
    statusText: "Đang hoạt động",
    address: dto.address ?? "Đang cập nhật địa chỉ",
    price: "10 – 12.000 VND / 1 Hour",
    visited: `${dto.visited} visited`,
    stars: 4,
    latitude: dto.latitude,
  };
}

export default function ListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();

  // --- UI state cho các radio ---
  const [costOrder, setCostOrder] = useState("");     // "expensive-cheap" | "cheap-expensive" | ""
  const [ratingOrder, setRatingOrder] = useState(""); // "low-high" | "high-low" | ""
  const [visitedOrder, setVisitedOrder] = useState(""); // "most-least" | "least-most" | "favourite" | ""

  // Tính Desc từ giá trị truyền vào (tránh đọc state cũ)
  function computeDescFrom(c, r, v) {
    if (v === "most-least" || v === "favourite") return true;
    if (v === "least-most") return false;
    if (r === "high-low") return true;
    if (r === "low-high") return false;
    if (c === "expensive-cheap") return true;
    if (c === "cheap-expensive") return false;
    return false;
  }

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await fetch("https://localhost:7229/api/Store/GetAll/all", { cache: "no-store" }); // ✅ sửa endpoint
      const json = await res.json();
      const arr = Array.isArray(json?.data) ? json.data : [];
      setItems(arr.map((dto, i) => mapStoreDtoToCard(normalizeDto(dto), i)));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPaged(desc, q) {
    const params = new URLSearchParams({
      PageIndex: "1",
      PageSize: "12",
      SortBy: "DisplayOrder",
      Desc: String(!!desc),
    });
    if (q && q.trim().length) params.set("q", q.trim());

    setLoading(true);
    try {
      const res = await fetch(`/api/Store/GetPaged?${params.toString()}`, { cache: "no-store" });
      const json = await res.json();
      const paged = json?.data;
      const arr = Array.isArray(paged?.items) ? paged.items : Array.isArray(paged) ? paged : [];
      setItems(arr.map((dto, i) => mapStoreDtoToCard(normalizeDto(dto), i)));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // Đọc ?q= lần đầu / khi URL đổi
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const q = sp.get("q")?.trim() ?? "";
    setSearch(q);
    if (q) {
      const desc = computeDescFrom(costOrder, ratingOrder, visitedOrder);
      fetchPaged(desc, q);
    } else {
      fetchAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Handlers radio: tính desc từ "giá trị mới" rồi fetchPaged
  const onCostChange = (value) => {
    const nextDesc = computeDescFrom(value, ratingOrder, visitedOrder);
    setCostOrder(value);
    fetchPaged(nextDesc, search);
  };
  const onRatingChange = (value) => {
    const nextDesc = computeDescFrom(costOrder, value, visitedOrder);
    setRatingOrder(value);
    fetchPaged(nextDesc, search);
  };
  const onVisitedChange = (value) => {
    const nextDesc = computeDescFrom(costOrder, ratingOrder, value);
    setVisitedOrder(value);
    fetchPaged(nextDesc, search);
  };

  // Search box: Enter/click → gọi GetPaged với Desc hiện tại
  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      const desc = computeDescFrom(costOrder, ratingOrder, visitedOrder);
      fetchPaged(desc, search);
    }
  };

  return (
    <>
      <div className="bg-gradient"></div>

      <Header />
      <main className="container" style={{ paddingTop: 100 }}>
        <div className={`${styles["list-layout"]} ${styles["scale-wrap"]}`}>
          {/* Filters */}
          <aside className={styles.filters}>
            <h1 className={styles["page-title"]}>Browse</h1>

            <div className={styles["filter-block"]}>
              <label className={styles.label}>Search</label>
              <div className={styles["input-with-icon"]}>
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                />
                <button
                  className={styles["circle-btn"]}
                  aria-label="Go"
                  type="button"
                  onClick={() => {
                    const desc = computeDescFrom(costOrder, ratingOrder, visitedOrder);
                    fetchPaged(desc, search);
                  }}
                  title="Search"
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
            </div>

            {/* Các block khác giữ nguyên UI */}
            <div className={styles["filter-block"]}>
              <label className={styles.label}>Area</label>
              <div className={styles["input-with-icon"]}>
                <input type="text" placeholder="Type your addresss" />
                <button className={styles["circle-btn"]} aria-label="Go" type="button">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12h13M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles["filter-block"]}>
              <label className={styles.label}>Cost</label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="cost"
                  checked={costOrder === "expensive-cheap"}
                  onChange={() => onCostChange("expensive-cheap")}
                />{" "}
                <span>Expensive – Cheap</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="cost"
                  checked={costOrder === "cheap-expensive"}
                  onChange={() => onCostChange("cheap-expensive")}
                />{" "}
                <span>Cheap – Expensive</span>
              </label>
            </div>

            <div className={styles["filter-block"]}>
              <label className={styles.label}>Rating</label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="rating"
                  checked={ratingOrder === "low-high"}
                  onChange={() => onRatingChange("low-high")}
                />{" "}
                <span>Low – High</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="rating"
                  checked={ratingOrder === "high-low"}
                  onChange={() => onRatingChange("high-low")}
                />{" "}
                <span>High – Low</span>
              </label>
            </div>

            <div className={styles["filter-block"]}>
              <label className={styles.label}>Visited</label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="visited"
                  checked={visitedOrder === "most-least"}
                  onChange={() => onVisitedChange("most-least")}
                />{" "}
                <span>Most – Least</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="visited"
                  checked={visitedOrder === "least-most"}
                  onChange={() => onVisitedChange("least-most")}
                />{" "}
                <span>Least – Most</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="visited"
                  checked={visitedOrder === "favourite"}
                  onChange={() => onVisitedChange("favourite")}
                />{" "}
                <span>Favourite</span>
              </label>
            </div>
          </aside>

          {/* Results */}
          <section className={styles.results}>
            {loading && <div style={{ opacity: 0.75, padding: 12 }}>Loading...</div>}
            {!loading && items.length === 0 && (
              <div style={{ opacity: 0.75, padding: 12 }}>No data</div>
            )}

            {!loading &&
              items.map((item, idx) => (
                <article key={`${item.id}-${idx}`} className={styles.card}>
                  <img className={styles.thumb} src={item.img} alt={item.name} />
                  <div className={styles.meta}>
                    <div className={styles["card-head"]}>
                      <h3>{item.name}</h3>
                      <span className={`${styles.status} ${styles[item.status]}`}>
                        <span className={styles.dot} />
                        <span className={styles["status-label"]}>{item.statusText}</span>
                      </span>
                    </div>

                    <p className={styles.address}>{item.address}</p>
                    <p className={styles.price}>{item.price}</p>

                    {/* “Khoảng cách” fake từ Latitude */}
                    <p className={styles.price} style={{ opacity: 0.9 }}>
                      {toKmFromLatitude(item.latitude)}
                    </p>

                    <div className={styles.foot}>
                      <span className={styles.visited}>{item.visited}</span>
                      <Stars value={item.stars} />
                      <Link className={styles.btn} to={`/detail/${item.id}`}>
                        Explore
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

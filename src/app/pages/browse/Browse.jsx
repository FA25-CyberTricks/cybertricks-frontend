import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

import styles from "./browse.module.css";
import "../../../assets/css/user-global.css";

// ========== Helpers (UI) ==========
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

// ========== Helpers (DTO) ==========
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
    // Nếu BE có thêm các field khác như Rating/PricePerHour thì map vào đây
    rating: dto?.rating ?? dto?.Rating,
    pricePerHour: dto?.pricePerHour ?? dto?.PricePerHour,
  };
}

function mapStoreDtoToCard(dto, idx) {
  return {
    id: dto.storeId ?? idx + 1,
    img: dto.avatar && String(dto.avatar).trim() ? dto.avatar : fallbackThumb(idx),
    name: dto.name ?? "Unnamed Store",
    status: "is-online",
    statusText: "Đang hoạt động",
    address: dto.address ?? "Đang cập nhật địa chỉ",
    price: "10 – 12.000 VND / 1 Hour",
    visited: `${dto.visited ?? 0} visited`,
    stars: Math.max(0, Math.min(5, Number(dto.rating) || 4)),
    latitude: dto.latitude,
  };
}

// ========== Helpers (OData) ==========
function escapeODataString(s) {
  // OData: escape single-quote
  return s.replace(/'/g, "''");
}

/**
 * Ưu tiên order theo nhóm Visited > Rating > Cost
 * - Visited: "most-least" (desc), "least-most" (asc), "favourite" (desc)
 * - Rating: "high-low" (desc), "low-high" (asc)
 * - Cost: "expensive-cheap" (desc), "cheap-expensive" (asc)
 * Đổi tên field ở đây cho khớp BE (nếu khác):
 *  - Visited -> Visited
 *  - Rating  -> Rating
 *  - Price   -> PricePerHour
 */
function buildOrderBy(costOrder, ratingOrder, visitedOrder) {
  if (visitedOrder === "most-least") return "Visited desc";
  if (visitedOrder === "least-most") return "Visited asc";
  if (visitedOrder === "favourite") return "Visited desc"; // hoặc Favourite desc nếu bạn có cờ riêng

  if (ratingOrder === "high-low") return "Rating desc";
  if (ratingOrder === "low-high") return "Rating asc";

  if (costOrder === "expensive-cheap") return "PricePerHour desc";
  if (costOrder === "cheap-expensive") return "PricePerHour asc";

  return "Name asc";
}

function buildFilter(q) {
  if (!q || !q.trim()) return "";
  const k = escapeODataString(q.trim());
  // Tìm theo Name + Address (đổi field nếu BE khác)
  return `contains(Name,'${k}') or contains(Address,'${k}')`;
}

async function fetchStoresOData({
  baseUrl,
  q,
  top = 12,
  skip = 0,
  costOrder,
  ratingOrder,
  visitedOrder,
  signal,
}) {
  const $orderby = buildOrderBy(costOrder, ratingOrder, visitedOrder);
  const filter = buildFilter(q);

  const params = new URLSearchParams();
  params.set("$top", String(top));
  params.set("$skip", String(skip));
  params.set("$count", "true");
  params.set("$orderby", $orderby);
  if (filter) params.set("$filter", filter);
  // Nếu cần mở rộng điều hướng: params.set("$expand", "Brand");

  const url = `${baseUrl}/odata/Stores?${params.toString()}`;
  const res = await fetch(url, { cache: "no-store", signal });
  if (!res.ok) throw new Error(`OData error ${res.status}`);
  return res.json(); // OData v4: { value: [...], @odata.count: N }
}

// ========== Component ==========
export default function ListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();

  // Radio states
  const [costOrder, setCostOrder] = useState("");      // "expensive-cheap" | "cheap-expensive" | ""
  const [ratingOrder, setRatingOrder] = useState("");  // "low-high" | "high-low" | ""
  const [visitedOrder, setVisitedOrder] = useState(""); // "most-least" | "least-most" | "favourite" | ""

  // Đổi sang env của bạn:
  // CRA: REACT_APP_API_BASE_URL
  // Vite: import.meta.env.VITE_API_BASE_URL (nếu bạn dùng Vite, thay dòng dưới)
  const API_BASE = process.env.REACT_APP_API_BASE_URL || "https://localhost:7229";

  // Load lần đầu / khi URL ?q= đổi
  useEffect(() => {
    const controller = new AbortController();
    const sp = new URLSearchParams(location.search);
    const q = sp.get("q")?.trim() || "";
    setSearch(q);

    (async () => {
      setLoading(true);
      try {
        const json = await fetchStoresOData({
          baseUrl: API_BASE,
          q,
          top: 12,
          skip: 0,
          costOrder,
          ratingOrder,
          visitedOrder,
          signal: controller.signal,
        });
        const arr = Array.isArray(json?.value) ? json.value : [];
        setItems(arr.map((raw, i) => mapStoreDtoToCard(normalizeDto(raw), i)));
      } catch (e) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]); // chỉ reload khi query-string đổi

  // Fetch lại với order hiện tại
  async function refetchWithCurrentOrders() {
    const controller = new AbortController();
    setLoading(true);
    try {
      const json = await fetchStoresOData({
        baseUrl: API_BASE,
        q: search,
        top: 12,
        skip: 0,
        costOrder,
        ratingOrder,
        visitedOrder,
        signal: controller.signal,
      });
      const arr = Array.isArray(json?.value) ? json.value : [];
      setItems(arr.map((raw, i) => mapStoreDtoToCard(normalizeDto(raw), i)));
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // Handlers radio (order only)
  const onCostChange = (value) => {
    setCostOrder(value);
    // Nếu muốn mỗi lần chỉ 1 nhóm “thắng thế”, có thể reset 2 nhóm kia:
    // setRatingOrder(""); setVisitedOrder("");
    refetchWithCurrentOrders();
  };
  const onRatingChange = (value) => {
    setRatingOrder(value);
    // setCostOrder(""); setVisitedOrder("");
    refetchWithCurrentOrders();
  };
  const onVisitedChange = (value) => {
    setVisitedOrder(value);
    // setCostOrder(""); setRatingOrder("");
    refetchWithCurrentOrders();
  };

  // Search box: Enter → fetch theo order hiện tại
  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      refetchWithCurrentOrders();
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
            <h1 className={styles["page-title"]}>Cyber Cafés</h1>

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
                  onClick={refetchWithCurrentOrders}
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

            {/* Area (chưa hook API – giữ UI) */}
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

            {/* Cost */}
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

            {/* Rating */}
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

            {/* Visited */}
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

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useParams, useNavigate } from "react-router-dom"; // 👈 lấy shopId từ URL
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

import useDragScroll from "../detail/hook/useDragScroll";
import "../../../../assets/css/user-global.css";
import styles from "./detail.module.css";

/* =================== module-scope helpers/constants =================== */
const pad2 = (n) => String(n).padStart(2, "0");
const minutesToLabel = (m) => `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
const range = (n) => Array.from({ length: n }, (_, i) => i);
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Timebar constants (bất biến)
const PX_PER_MIN = 1; // 1 phút = 1px
const TOTAL_MIN = 1440; // 24h
const TRACK_WIDTH = TOTAL_MIN * PX_PER_MIN;
const TRACK_HEIGHT = 72;
const clamp = (v, min = 0, max = TOTAL_MIN) => Math.min(Math.max(v, min), max);

/* =================== Hero =================== */
function Hero({ name }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg}>
        <span style={{ "--bg": "url(/assets/images/store-1.jpg)" }} />
        <span style={{ "--bg": "url(/assets/images/store-2.jpg)" }} />
        <span style={{ "--bg": "url(/assets/images/store-3.jpg)" }} />
      </div>

      <div className={`${styles["hero-inner"]} container`}>
        <h1>{name || "Loading..."}</h1>
        <p>
          {name || "Loading..."} Vietnam offers comprehensive solutions for
          premium cyber cafes.
          <br />
          New Cyber Cafe Setup • System Upgrades • Franchise Opportunities
          <br />| 20+ Years of Experience | 1268+ Projects Completed |
        </p>
      </div>
    </section>
  );
}

/* =================== Panels =================== */
function Panels({ address, phone }) {
  return (
    <section className="container" style={{ marginTop: -60 }}>
      <div className={styles.panel}>
        <div className={styles["grid-3"]}>
          <div className={styles.card}>
            <p>
              Here, all your needs are fully covered from A to Z. From a large
              number of high-performance PCs to spacious, well-divided areas,
              you can choose services based on your desired setup and privacy
              level.
            </p>
            <ul style={{ margin: "12px 0 0", opacity: 0.95 }}>
              <li>High-performance PCs for all game genres.</li>
              <li>Modern, spacious design with advanced setups.</li>
              <li>Soft sofa chairs for long, comfortable gaming.</li>
              <li>Private Couple Zone for pairs.</li>
              <li>
                Pro eSports Gaming House with 39&quot; curved 144Hz monitors.
              </li>
              <li>Variety of food and drinks available.</li>
            </ul>
          </div>

          <div className={`${styles.card} ${styles.white}`}>
            <h3 style={{ margin: "0 0 8px", fontSize: 24 }}>Configuration:</h3>
            <div className={styles.kvs}>
              <div>CPU Intel Core i7</div>
              <div>GPU NVIDIA GeForce RTX 3060</div>
              <div>RAM 16GB</div>
              <div>SSD 512GB</div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.kvs} style={{ gap: 12 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#fff"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2l7 7-7 7-7-7 7-7Zm0 13a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
                    opacity=".3"
                  />
                </svg>
                {address || "Address is being updated"}
              </div>
              <div>
                <strong>{phone || "Updating phone..."}</strong>
              </div>
              <div>info@cybercore.vn</div>
              <div>Always open</div>
              <div>10 – 12.000 VND</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================== DatePicker (overlay) =================== */
function DatePicker({ open, value, onClose, onChange }) {
  const [view, setView] = useState(
    () => new Date(value.getFullYear(), value.getMonth(), 1)
  );

  useEffect(() => {
    if (open) setView(new Date(value.getFullYear(), value.getMonth(), 1));
  }, [open, value]);

  const days = useMemo(() => {
    const y = view.getFullYear();
    const m = view.getMonth();
    const first = new Date(y, m, 1);
    const shift = (first.getDay() + 7) % 7;
    const start = new Date(y, m, 1 - shift);
    return range(42).map((i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [view]);

  if (!open) return null;

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const onPick = (d) =>
    onChange(new Date(d.getFullYear(), d.getMonth(), d.getDate()));

  const today = new Date();
  const titleMonth = MONTHS[view.getMonth()];
  const titleYear = view.getFullYear();

  return (
    <div
      className={styles.datepicker}
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles["dp-panel"]}>
        <div className={styles["dp-head"]}>
          <button
            className={`${styles["dp-nav"]} ${styles["dp-prev"]}`}
            aria-label="Previous month"
            onClick={() =>
              setView((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1))
            }
          >
            ‹
          </button>
          <div className={styles["dp-title"]}>
            <span className="dp-month">{titleMonth}</span>{" "}
            <span className="dp-year">{titleYear}</span>
          </div>
          <button
            className={`${styles["dp-nav"]} ${styles["dp-next"]}`}
            aria-label="Next month"
            onClick={() =>
              setView((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1))
            }
          >
            ›
          </button>
        </div>

        <div className={`${styles["dp-grid"]} ${styles["dp-week"]}`}>
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        <div className={`${styles["dp-grid"]} ${styles["dp-days"]}`}>
          {days.map((d, i) => {
            const out = d.getMonth() !== view.getMonth();
            const classes = [
              out ? styles.out : "",
              isSameDay(d, today) ? styles.today : "",
              isSameDay(d, value) ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <button
                key={i}
                type="button"
                className={classes}
                onClick={() => onPick(d)}
                title={d.toDateString()}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        <div className={styles["dp-foot"]}>
          <button
            className={`${styles.btn} ${styles["dp-today"]}`}
            type="button"
            onClick={() =>
              onChange(
                new Date(today.getFullYear(), today.getMonth(), today.getDate())
              )
            }
          >
            Today
          </button>
          <button
            className={`${styles.btn} ${styles["dp-close"]}`}
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =================== Timebar 0–24h (range) =================== */
function Timebar({ startMin, endMin, onChange }) {
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  // useDragScroll(scrollRef, "x");

  const [drag, setDrag] = useState(null); // 'start' | 'end' | null

  const minToX = (m) => m * PX_PER_MIN;

  const xToMin = useCallback((clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const x = clamp(clientX - rect.left, 0, TRACK_WIDTH);
    return Math.round(x / PX_PER_MIN);
  }, []);

  useEffect(() => {
    if (!drag) return;

    const onMove = (e) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const m = clamp(xToMin(clientX), 0, TOTAL_MIN);
      if (drag === "start") onChange([clamp(m, 0, endMin), endMin]);
      else if (drag === "end")
        onChange([startMin, clamp(m, startMin, TOTAL_MIN)]);
      e.preventDefault();
    };
    const onUp = () => setDrag(null);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [drag, startMin, endMin, onChange, xToMin]);

  const ticks = useMemo(
    () =>
      Array.from({ length: 25 }, (_, h) => ({
        left: h * 60 * PX_PER_MIN,
        label: `${pad2(h)}:00`,
      })),
    []
  );

  const handleTrackClick = (e) => {
    if (e.target.closest(".timebar-handle")) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const m = clamp(xToMin(clientX), 0, TOTAL_MIN);
    const dStart = Math.abs(m - startMin);
    const dEnd = Math.abs(m - endMin);
    if (dStart <= dEnd) onChange([clamp(m, 0, endMin), endMin]);
    else onChange([startMin, clamp(m, startMin, TOTAL_MIN)]);
  };

  const left = minToX(startMin);
  const right = minToX(endMin);
  const width = Math.max(right - left, 0);

  return (
    <div className="timebar-wrap">
      <div
        className="timebar-scroll scrollbar-slim"
        ref={scrollRef}
        style={{ maxWidth: "100%" }}
      >
        <div
          className="timebar-track"
          ref={trackRef}
          style={{
            width: TRACK_WIDTH,
            height: TRACK_HEIGHT + 32,
            position: "relative",
          }}
          onMouseDown={handleTrackClick}
          onTouchStart={handleTrackClick}
        >
          <div
            className="timebar-range"
            style={{ left, width, height: TRACK_HEIGHT - 16 }}
          />

          <div className="timebar-ticks">
            {ticks.map((t) => (
              <div
                key={t.label}
                className="timebar-tick"
                style={{ left: t.left }}
              >
                <span className="timebar-tick-line" />
                <span className="timebar-tick-label">{t.label}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="timebar-handle start"
            style={{ left }}
            onMouseDown={() => setDrag("start")}
            onTouchStart={(e) => {
              setDrag("start");
              e.stopPropagation();
            }}
            aria-label="Start time"
          >
            <span>{minutesToLabel(startMin)}</span>
          </button>

          <button
            type="button"
            className="timebar-handle end"
            style={{ left: right }}
            onMouseDown={() => setDrag("end")}
            onTouchStart={(e) => {
              setDrag("end");
              e.stopPropagation();
            }}
            aria-label="End time"
          >
            <span>{minutesToLabel(endMin)}</span>
          </button>
        </div>
      </div>

      <div className="timebar-footer">
        <button className={`${styles.btn} ${styles.primary}`} type="button">
          Find
        </button>
        <button
          className={`${styles.btn} ${styles.primary}`}
          type="button"
          onClick={() => onChange([7 * 60, 9 * 60])}
        >
          Reset 07:00–09:00
        </button>
      </div>
    </div>
  );
}

/* =================== Rooms & Seats =================== */
function Seat({ code, label, displayStatus, locked, onToggle }) {
  const cls = [
    styles.seat,
    styles[`seat--${displayStatus}`] || "",
    locked ? styles["seat--locked"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = () => {
    if (!locked) onToggle(code);
  };

  return (
    <div
      className={cls}
      data-code={label}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (!locked && (e.key === "Enter" || e.key === " ")) onToggle(code);
      }}
      title={`${label} • ${displayStatus}${locked ? " (locked)" : ""}`}
      style={{
        border: "1px solid rgba(0,0,0,.8)",
        outline: "1px solid rgba(0,0,0,.1)",
        cursor: locked ? "not-allowed" : "pointer",
      }}
    />
  );
}

function SeatGrid({ cfg, selectedSeats, onToggle, roomId }) {
  const { codePrefix = "A", columns = 10, rows = 2, map = {} } = cfg;
  const seats = [];
  for (let r = 0; r < rows; r++) {
    const rowCode = String.fromCharCode(codePrefix.charCodeAt(0) + r);
    for (let c = 1; c <= columns; c++) {
      const displayCode = `${rowCode}${String(c).padStart(2, "0")}`;
      const internalCode = `${roomId}:${displayCode}`;
      seats.push({ displayCode, internalCode });
    }
  }

  return (
    <div className={styles["seat-grid"]} style={{ "--cols": String(columns) }}>
      {seats.map(({ displayCode, internalCode }) => {
        const baseStatus = map[displayCode] || "available";
        const locked = baseStatus === "occupied" || baseStatus === "reserved";
        const displayStatus = locked
          ? baseStatus
          : selectedSeats.has(internalCode)
          ? "selected"
          : "available";

        return (
          <Seat
            key={internalCode}
            code={internalCode}
            label={displayCode}
            displayStatus={displayStatus}
            locked={locked}
            onToggle={onToggle}
          />
        );
      })}
    </div>
  );
}

function Rooms({ selectedSeats, onToggleSeat }) {
  const vipMap = { A03: "occupied", A08: "reserved", B05: "maintenance", B09: "event" };
  const normalMap = { A02: "reserved", A06: "occupied", A10: "occupied", A11: "maintenance" };
  const coupleMap = { A01: "occupied", A02: "reserved", B03: "reserved" };
  const trainingMap = { A04: "occupied", A05: "reserved", A06: "occupied" };

  const wrapperRef = useRef(null);
  useDragScroll(wrapperRef, "xy");

  const toggleSeat = (internalCode) => onToggleSeat(internalCode);

  return (
    <div ref={wrapperRef} className={`${styles.rooms} ${styles["scrollbar-slim"]}`}>
      <div className={styles["room-grid"]}>
        <div className={styles.room}>
          <h4>Vip room</h4>
          <div className={styles["grid-box"]}>
            <SeatGrid
              roomId="vip"
              cfg={{ codePrefix: "A", columns: 9, rows: 2, map: vipMap }}
              selectedSeats={selectedSeats}
              onToggle={toggleSeat}
            />
          </div>
        </div>

        <div className={styles.room}>
          <h4>Normal room</h4>
          <div className={styles["grid-box"]}>
            <SeatGrid
              roomId="normal"
              cfg={{ codePrefix: "A", columns: 12, rows: 1, map: normalMap }}
              selectedSeats={selectedSeats}
              onToggle={toggleSeat}
            />
          </div>
        </div>

        <div className={styles.room}>
          <h4>Couple room</h4>
          <div className={styles["grid-box"]}>
            <SeatGrid
              roomId="couple"
              cfg={{ codePrefix: "A", columns: 6, rows: 2, map: coupleMap }}
              selectedSeats={selectedSeats}
              onToggle={toggleSeat}
            />
          </div>
        </div>

        <div className={styles.room}>
          <h4>Training room</h4>
          <div className={styles["grid-box"]}>
            <SeatGrid
              roomId="training"
              cfg={{ codePrefix: "A", columns: 10, rows: 1, map: trainingMap }}
              selectedSeats={selectedSeats}
              onToggle={toggleSeat}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


/* =================== Food =================== */
const FOOD = [
  {
    id: "myxao",
    name: "My xao",
    price: 20000,
    img: "/assets/images/food-1.jpg",
  },
  {
    id: "mytom2trung",
    name: "My tom 2 trung",
    price: 20000,
    img: "/assets/images/food-2.jpg",
  },
  {
    id: "comchien1",
    name: "Com chien trung",
    price: 20000,
    img: "/assets/images/food-3.jpg",
  },
  {
    id: "sting",
    name: "Sting do",
    price: 20000,
    img: "/assets/images/drink-1.jpg",
  },
  {
    id: "comchien2",
    name: "Com chien trung",
    price: 20000,
    img: "/assets/images/drink-2.jpg",
  },
];

function Food() {
  const [qty, setQty] = useState(() => {
    const init = Object.fromEntries(FOOD.map((f) => [f.id, 0]));
    init.mytom2trung = 2;
    init.sting = 2;
    return init;
  });
  const inc = (id) => setQty((q) => ({ ...q, [id]: (q[id] || 0) + 1 }));
  const dec = (id) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] || 0) - 1) }));

  return (
    <section className={`container ${styles.food}`} id="food">
      <h3>Best food for you!</h3>
      <div className={styles.panel} style={{ padding: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div>
            <strong>Voucher:</strong> <em>1 voucher is available</em>
          </div>
          <div style={{ textTransform: "uppercase" }}>
            FullGearFreeHour <em>(- 20.000 VND / Bill)</em>
          </div>
        </div>

        <div className={styles["food-grid"]}>
          {FOOD.map((f) => (
            <article key={f.id} className={styles["food-card"]}>
              <img src={f.img} alt={f.name} />
              <h4 style={{ margin: "8px 0 4px" }}>{f.name}</h4>
              <div className={styles.muted}>{f.price.toLocaleString()} VND</div>

              <div className={styles.qty} style={{ margin: "8px 0" }}>
                <span
                  className={styles.chip}
                  onClick={() => dec(f.id)}
                  role="button"
                  tabIndex={0}
                >
                  -
                </span>
                <span className={styles.chip}>{qty[f.id] || 0}</span>
                <span
                  className={styles.chip}
                  onClick={() => inc(f.id)}
                  role="button"
                  tabIndex={0}
                >
                  +
                </span>
              </div>

              <button
                className={`${styles.btn} ${styles.primary}`}
                type="button"
              >
                Add to cart
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================== Feedback =================== */
function Feedback() {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  return (
    <section className={`container ${styles.feedback}`} id="feedback">
      <h2 style={{ fontSize: 48, margin: "0 0 12px" }}>Feedback</h2>

      <div className={styles["review-row"]}>
        {[1, 2].map((i) => (
          <div key={i} className={styles["review-card"]}>
            <div className={styles["avatar-round"]}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  background: "#000",
                  borderRadius: "50%",
                }}
              />
            </div>
            <div>
              <strong>Person {i}</strong>
              <p style={{ color: "#000", opacity: 0.9 }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. ...
              </p>
              <div className={styles.stars}>
                <div className={styles.star} />
                <div className={styles.star} />
                <div className={styles.star} />
                <div className={styles.star} />
                <div className={`${styles.star} ${styles.hollow}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.comment}>
        <input
          placeholder="Your comment here"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className={styles.send}
          title="Send"
          type="button"
          onClick={() => setComment("")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>
        </button>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <strong>Your rating:</strong>
        <div className={styles.stars} id="yourStars">
          {range(5).map((i) => (
            <button
              key={i}
              className={`${styles.star} ${i < rating ? "" : styles.hollow}`}
              aria-label={`${i + 1} star`}
              onClick={() => setRating(i + 1)}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================== Booking Section =================== */
function Booking({ shopId }) {
  const navigate = useNavigate();
  const [dpOpen, setDpOpen] = useState(false);
  const [date, setDate] = useState(() => new Date(2025, 4, 1));
  const [[startMin, endMin], setRange] = useState([7 * 60, 9 * 60]);

  // ✅ LIFT state ghế lên đây
  const [selectedSeats, setSelectedSeats] = useState(() => new Set());

  const toggleSeat = (internalCode) => {
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      next.has(internalCode)
        ? next.delete(internalCode)
        : next.add(internalCode);
      return next;
    });
  };

  const goToPayment = () => {
    const qs = new URLSearchParams({
      start: String(startMin),
      end: String(endMin),
      date: date.toISOString().slice(0, 10),
      // seats: vip:A01,normal:B02,couple:A03 ...
      seats: Array.from(selectedSeats).join(","),
    }).toString();

    navigate(`/payment/${shopId}?${qs}`);
  };

  return (
    <section className={`container ${styles.booking}`} id="booking">
      <h2>Booking</h2>

      <div className={styles["date-row"]}>
        <div className={`${styles.pill} ${styles["pill-info"]}`}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="#fff"
            aria-hidden="true"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="3"
              stroke="#fff"
              fill="none"
            />
            <path d="M3 9h18" stroke="#fff" />
          </svg>
          <div className="pill-text">
            <span className={styles.label}>Choose day</span>
          </div>
        </div>

        <div className={styles["pickers-inline"]}>
          <div className="picker" data-field="day">
            <button
              className={`${styles.select} ${styles.block}`}
              type="button"
              onClick={() => setDpOpen(true)}
            >
              <span className="value">{pad2(date.getDate())}</span>
              <small>Day</small>
            </button>
          </div>
          <div className="picker" data-field="month">
            <button
              className={`${styles.select} ${styles.block}`}
              type="button"
              onClick={() => setDpOpen(true)}
            >
              <span className="value">{pad2(date.getMonth() + 1)}</span>
              <small>Month</small>
            </button>
          </div>
          <div className="picker wide" data-field="year">
            <button
              className={`${styles.select} ${styles.block}`}
              type="button"
              onClick={() => setDpOpen(true)}
            >
              <span className="value">{date.getFullYear()}</span>
              <small>Year</small>
            </button>
          </div>
        </div>
      </div>

      <Timebar startMin={startMin} endMin={endMin} onChange={setRange} />
      <div className={styles.inlineRow}>
        <div className={styles.chooser}>
          <div className={styles.field}>
            <select id="stairSelect" defaultValue="">
              <option value="1">Stair 1</option>
              <option value="2">Stair 2</option>
              <option value="3">Stair 3</option>
              <option value="4">Stair 4</option>
              <option value="5">Stair 5</option>
            </select>
          </div>
        </div>

        <div className={styles.legendInline}>
          <div
            className={styles.swatch}
            style={{
              background: "var(--seat-available-bg)",
              border: "1px solid #000",
            }}
          />
          <em>Available</em>
          <div
            className={styles.swatch}
            style={{ background: "var(--seat-selected-bg)" }}
          />
          <em>Selected</em>
          <div
            className={styles.swatch}
            style={{ background: "var(--seat-reserved-bg)" }}
          />
          <em>Reserved (hold)</em>
          <div
            className={styles.swatch}
            style={{ background: "var(--seat-occupied-bg)" }}
          />
          <em>Occupied</em>
        </div>
      </div>

      <Rooms selectedSeats={selectedSeats} onToggleSeat={toggleSeat} />

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button
          className={`${styles.btn} ${styles.primary}`}
          type="button"
          onClick={goToPayment}
        >
          Book now ({minutesToLabel(startMin)}–{minutesToLabel(endMin)})
        </button>
      </div>

      <DatePicker
        open={dpOpen}
        value={date}
        onClose={() => setDpOpen(false)}
        onChange={(d) => {
          setDate(d);
          setDpOpen(false);
        }}
      />
    </section>
  );
}

/* =================== Page =================== */
export default function ShopDetail() {
  const { shopId } = useParams(); // 👈 /detail/:shopId
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(false);

  // chuẩn hóa DTO (BE PascalCase/camelCase)
  const normalizeDto = (dto) => ({
    storeId: dto?.storeId ?? dto?.StoreId,
    name: dto?.name ?? dto?.Name,
    address: dto?.address ?? dto?.Address,
    contactPhone: dto?.contactPhone ?? dto?.ContactPhone,
    latitude: dto?.latitude ?? dto?.Latitude,
    avatar: dto?.avatar ?? dto?.Avatar ?? null,
  });

  useEffect(() => {
    let ignore = false;
    async function fetchById(id) {
      setLoading(true);
      try {
        const res = await fetch(`/api/Store/GetById/${id}`, {
          cache: "no-store",
        });
        const json = await res.json();
        const dto = json?.data ? normalizeDto(json.data) : null;
        if (!ignore) setStore(dto);
      } catch (e) {
        if (!ignore) setStore(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    if (shopId) fetchById(shopId);
  }, [shopId]);

  return (
    <>
      <div className="bg-gradient"></div>
      <Header />
      <main className={styles.page}>
        <Hero name={store?.name} />
        <Panels address={store?.address} phone={store?.contactPhone} />
        <Booking shopId={shopId} />
        <Food />
        <Feedback />
        {loading && (
          <div className="container" style={{ padding: 12, opacity: 0.8 }}>
            Loading...
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

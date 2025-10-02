import React, { useMemo, useRef, useState } from "react";
import useDragScroll from "../hook/useDragScroll";
import styles from "../detail.module.css";

// độ rộng mỗi 30 phút
const SLOT_WIDTH = 80; // 24h * 2 * 80 = 3840px

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const snap30 = (min) => Math.round(min / 30) * 30;
const toMin = (x) => snap30((x / SLOT_WIDTH) * 30); // px -> minutes
const toLeft = (min) => (min / 30) * SLOT_WIDTH;     // minutes -> px
const fmt = (m) => {
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

export default function TimeBar({
  value = { start: 8 * 60, end: 9 * 60 }, // default 08:00–09:00
  onChange = () => {},
  height = 84,
}) {
  const wrapRef = useRef(null);
  useDragScroll(wrapRef, "x");

  // track width 24h
  const width = 24 * 2 * SLOT_WIDTH; // 48 nửa giờ

  // ticks mỗi giờ
  const hours = useMemo(() => Array.from({ length: 25 }, (_, h) => h), []);

  // drag handle
  const [drag, setDrag] = useState(null); // 'start' | 'end' | null

  const onDown = (e, which) => {
    e.stopPropagation();
    setDrag(which);
  };
  const onUp = () => setDrag(null);

  const onMove = (e) => {
    if (!drag) return;
    const el = wrapRef.current;
    const rect = el.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left + el.scrollLeft; // position in content coords
    let nextMin = clamp(toMin(x), 0, 24 * 60);

    // giữ thứ tự start <= end
    if (drag === "start") {
      nextMin = Math.min(nextMin, value.end);
      onChange({ ...value, start: nextMin });
    } else {
      nextMin = Math.max(nextMin, value.start);
      onChange({ ...value, end: nextMin });
    }
  };

  const onTrackClick = (e) => {
    // click trên track: nhảy con trỏ gần hơn
    const el = wrapRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left + el.scrollLeft;
    const m = clamp(toMin(x), 0, 24 * 60);
    // chọn cạnh gần hơn
    const dStart = Math.abs(m - value.start);
    const dEnd = Math.abs(m - value.end);
    onChange(dStart <= dEnd ? { ...value, start: m } : { ...value, end: m });
  };

  return (
    <div className={styles["timebar-wrap"]}>
      <div
        className={`${styles["timebar-scroll"]} ${styles["scrollbar-slim"]}`}
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchMove={onMove}
        onTouchEnd={onUp}
      >
        <div
          className={styles["timebar-track"]}
          style={{ width, height }}
          onClick={onTrackClick}
        >
          {/* vùng chọn */}
          <div
            className={styles["timebar-range"]}
            style={{
              left: toLeft(value.start),
              width: toLeft(value.end) - toLeft(value.start),
              height: height - 24,
            }}
          />

          {/* ticks giờ */}
          <div className={styles["timebar-ticks"]}>
            {hours.map((h) => (
              <div
                key={h}
                className={styles["timebar-tick"]}
                style={{ left: toLeft(h * 60) }}
              >
                <span className={styles["timebar-tick-line"]} />
                <span className={styles["timebar-tick-label"]}>
                  {String(h).padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>

          {/* handle start */}
          <button
            type="button"
            className={`${styles["timebar-handle"]} ${styles.start}`}
            style={{ left: toLeft(value.start) }}
            onMouseDown={(e) => onDown(e, "start")}
            onTouchStart={(e) => onDown(e, "start")}
            aria-label={`Start ${fmt(value.start)}`}
            title={`Start ${fmt(value.start)}`}
          >
            <span>{fmt(value.start)}</span>
          </button>

          {/* handle end */}
          <button
            type="button"
            className={`${styles["timebar-handle"]} ${styles.end}`}
            style={{ left: toLeft(value.end) }}
            onMouseDown={(e) => onDown(e, "end")}
            onTouchStart={(e) => onDown(e, "end")}
            aria-label={`End ${fmt(value.end)}`}
            title={`End ${fmt(value.end)}`}
          >
            <span>{fmt(value.end)}</span>
          </button>
        </div>
      </div>

      <div className={styles["timebar-footer"]}>
        <div>Start: <strong>{fmt(value.start)}</strong></div>
        <div>End: <strong>{fmt(value.end)}</strong></div>
        <div>Duration: <strong>{((value.end - value.start) / 60).toFixed(1)}h</strong></div>
      </div>
    </div>
  );
}

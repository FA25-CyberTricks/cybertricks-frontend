import { useEffect } from "react";

export default function useDragScroll(ref, axis = "xy") {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false, startX = 0, startY = 0, sl = 0, st = 0, moved = false;
    const getPoint = (e) => ("touches" in e ? e.touches[0] : e);

    const start = (e) => {
      isDown = true; moved = false;
      el.classList.add("is-dragging");
      const p = getPoint(e);
      startX = p.clientX; startY = p.clientY;
      sl = el.scrollLeft; st = el.scrollTop;
    };
    const move = (e) => {
      if (!isDown) return;
      const p = getPoint(e);
      const dx = p.clientX - startX;
      const dy = p.clientY - startY;
      if (!moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) moved = true;
      if (axis.includes("x")) el.scrollLeft = sl - dx;
      if (axis.includes("y")) el.scrollTop  = st - dy;
      e.preventDefault();
    };
    const end = () => {
      isDown = false;
      if (moved) {
        const stop = (ev) => ev.stopPropagation();
        el.addEventListener("click", stop, { capture: true, once: true });
      }
      el.classList.remove("is-dragging");
    };

    el.addEventListener("mousedown", start);
    el.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    el.addEventListener("touchstart", start, { passive: false });
    el.addEventListener("touchmove", move, { passive: false });
    el.addEventListener("touchend", end);
    el.addEventListener("touchcancel", end);

    return () => {
      el.removeEventListener("mousedown", start);
      el.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end);
      el.removeEventListener("touchcancel", end);
    };
  }, [ref, axis]);
}

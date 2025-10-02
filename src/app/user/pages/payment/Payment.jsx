import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ toast
import Header from "../../layouts/header";
import Footer from "../../layouts/Footer";

import styles from "./payment.module.css";
import "../../../../assets/css/user-global.css";

// ===== helpers =====
const pad2 = (n) => String(n).padStart(2, "0");
const minutesToLabel = (m) => {
  const hh = Math.floor(Number(m || 0) / 60);
  const mm = Math.floor(Number(m || 0) % 60);
  return `${pad2(hh)}:${pad2(mm)}`;
};
const formatVND = (n) => `${(Number(n) || 0).toLocaleString("vi-VN")} VND`;
const fmt2 = (n) => Number(n || 0).toFixed(3);

export default function Payment() {
  const navigate = useNavigate();
  const { shopId } = useParams();
  const location = useLocation();

  // ---- state: store ----
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---- QR state ----
  const [qrUrl, setQrUrl] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState(null);

  // ---- Payment UI state ----
  const [paymentMethod, setPaymentMethod] = useState("banking");
  const [paid, setPaid] = useState(false);

  // ---- cấu hình nhận tiền (đổi theo thực tế) ----
  const BANK_BIN = "970415"; // Techcombank (ví dụ)
  const ACCOUNT_NO = "1900123456789"; // STK thụ hưởng
  const RECEIVER_NAME = "CYBERTRICKS"; // Tên hiển thị (IN HOA, không dấu)
  const CITY = "DANANG";

  const normalizeDto = (dto) => ({
    storeId: dto?.storeId ?? dto?.StoreId,
    name: dto?.name ?? dto?.Name,
    address: dto?.address ?? dto?.Address,
    contactPhone: dto?.contactPhone ?? dto?.ContactPhone,
    latitude: dto?.latitude ?? dto?.Latitude,
    avatar: dto?.avatar ?? dto?.Avatar ?? null,
  });

  // ---- fetch store ----
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
      } catch {
        if (!ignore) setStore(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (shopId) fetchById(shopId);
    return () => {
      ignore = true;
    };
  }, [shopId]);

  // ---- parse query ----
  const {
    startMin,
    endMin,
    dateStr,
    selectedSeats,
    chairCount,
    roomsText,
    floorText,
  } = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const start = Number(sp.get("start") || 0);
    const end = Number(sp.get("end") || 0);
    const date = sp.get("date") || "";
    const seatsCsv = (sp.get("seats") || "").trim();
    const arr = seatsCsv
      ? seatsCsv
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const roomSet = new Set();
    arr.forEach((code) => {
      const [roomId] = code.split(":");
      if (roomId) roomSet.add(roomId);
    });
    return {
      startMin: start,
      endMin: end,
      dateStr: date,
      selectedSeats: arr,
      chairCount: arr.length,
      roomsText: Array.from(roomSet).join(", ") || "—",
      floorText: sp.get("floor") ? String(sp.get("floor")) : "—",
    };
  }, [location.search]);

  // ---- derived labels & costs ----
  const startLabel = minutesToLabel(startMin);
  const endLabel = minutesToLabel(endMin);

  const durationHours = Math.max(0, (endMin - startMin) / 60);
  const pricePerHour = 12000; // 12.000 VND / giờ
  const seats = chairCount;
  const timeCost = Math.round(durationHours * pricePerHour * seats);

  const foodDrinkCost = 0;
  const voucherDiscount = 0;

  const subtotal = timeCost + foodDrinkCost;
  const total = Math.max(0, subtotal - voucherDiscount);

  // ---- back ----
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  // ---- Generate VietQR ----
  const handleGenerateQR = async () => {
    try {
      setQrLoading(true);
      setQrError(null);
      if (qrUrl) {
        URL.revokeObjectURL(qrUrl);
        setQrUrl(null);
      }

      const desc = [
        store?.name ? `Shop:${store.name}` : "",
        dateStr ? `Date:${dateStr}` : "",
        startLabel && endLabel ? `Time:${startLabel}-${endLabel}` : "",
        seats ? `Seats:${seats}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      const params = new URLSearchParams({
        bankBin: BANK_BIN,
        account: ACCOUNT_NO,
        name: RECEIVER_NAME,
        city: CITY,
        ...(total ? { amount: String(total) } : {}),
        ...(desc ? { desc } : {}),
        _: Date.now().toString(), // cache-busting
      });

      const res = await fetch(`/api/vietqr?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("QR API failed:", res.status, text);
        throw new Error(`QR API error: ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setQrUrl(url);
    } catch (err) {
      console.error(err);
      setQrError("Tạo QR thất bại. Vui lòng thử lại.");
    } finally {
      setQrLoading(false);
    }
  };

  // ---- Cleanup blob URL khi unmount/đổi QR ----
  useEffect(() => {
    return () => {
      if (qrUrl) URL.revokeObjectURL(qrUrl);
    };
  }, [qrUrl]);

  // ---- Pay with Balance: chưa có API => cho qua luôn + toast ----
  const handlePayWithBalance = async () => {
    setPaid(true);
    if (qrUrl) {
      URL.revokeObjectURL(qrUrl);
      setQrUrl(null);
    }
    toast.success(`Thanh toán thành công ${formatVND(total)}!`, {
      autoClose: 1800,
    });
    // (tuỳ chọn) chuyển trang sau 1.5s
    // setTimeout(() => navigate("/"), 1500);
  };

  return (
    <>
      <div className="bg-gradient"></div>

      <Header />
      <main
        className={`container ${styles.payment}`}
        style={{ padding: "100px 0 50px" }}
      >
        <h1 className={styles.pageTitle}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={handleBack}
            aria-label="Back"
          >
            &larr;
          </button>
          Payment
        </h1>

        <div className={styles.grid}>
          <section className={styles.ticket}>
            <h3>Booking detail</h3>

            <h2>{store?.name || (loading ? "Loading..." : "—")}</h2>
            <p className={styles.addr}>
              {store?.address || (loading ? "Loading..." : "—")}
            </p>

            <div className={styles.row}>
              <div>
                <strong>Date:</strong> {dateStr || "—"}
              </div>
              <div>
                <strong>Hour:</strong> {startLabel} - {endLabel}
              </div>
              <div>
                <strong>Floor:</strong> 1
              </div>
              <div>
                <strong>Room:</strong> {roomsText}
              </div>
              {!!selectedSeats.length && (
                <div>
                  <strong>Seats:</strong> {selectedSeats.join(", ")}
                </div>
              )}
            </div>

            <hr />

            <div className={styles.row}>
              <div>
                <strong>Voucher:</strong>{" "}
                {voucherDiscount ? "FULLGEARFREEHOUR" : "No Voucher"}
              </div>
            </div>
          </section>

          {paid ? (
            // ===== SUCCESS STATE =====
            <aside
              className={`${styles.summary} ${styles.success}`}
              id="summary"
            >
              <div className={styles.successBody}>
                <div>
                  <div className={styles.doneIcon}>
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="11" fill="#d80e0e" />
                      <path
                        d="M7 12.5l3.2 3.2L17 9"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className={styles.done}>Done!</h2>
              </div>

              <button
                type="button"
                className={`${styles.btn} ${styles.red} ${styles.wide}`}
                onClick={() => navigate("/")}
              >
                Home
              </button>
            </aside>
          ) : (
            // ===== SUMMARY =====
            <aside
              className={`${styles.summary} visible gradient-card`}
              id="summary"
            >
              <div>
                <h3>Summary</h3>
                <ul className={styles.lines}>
                  <li>
                    <span>
                      {startLabel} - {endLabel}
                      {floorText !== "—" ? `, floor ${floorText}` : ""}, {seats}{" "}
                      seat{seats !== 1 ? "s" : ""}
                      {roomsText !== "—"
                        ? `, ${roomsText} room${
                            roomsText.includes(",") ? "s" : ""
                          }`
                        : ""}
                      <br /> ({fmt2(durationHours)} h ×{" "}
                      {formatVND(pricePerHour)} × {seats})
                    </span>
                    <b>{formatVND(timeCost)}</b>
                  </li>

                  <li className={styles.sep} />

                  <li>
                    <span>Subtotal</span>
                    <b>{formatVND(subtotal)}</b>
                  </li>
                  <li>
                    <span>Voucher</span>
                    <b className={styles.disc}>-{formatVND(voucherDiscount)}</b>
                  </li>
                </ul>

                <hr />

                <div className={styles.total}>
                  <span>Total:</span>
                  <span>{formatVND(total)}</span>
                </div>
              </div>

              <div>
                <div className={styles.pm}>
                  <span>Payment method:</span>

                  <label className={styles.radio}>
                    <input
                      type="radio"
                      name="pm"
                      value="banking"
                      checked={paymentMethod === "banking"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Banking
                  </label>

                  <label className={styles.radio}>
                    <input
                      type="radio"
                      name="pm"
                      value="balance"
                      checked={paymentMethod === "balance"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Account Balance
                  </label>
                </div>

                {paymentMethod === "banking" ? (
                  <>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.red} ${styles.wide}`}
                      onClick={handleGenerateQR}
                      disabled={qrLoading}
                    >
                      {qrLoading ? "Generating..." : "Generate QR code"}
                    </button>

                    {/* Hiển thị QR dưới nút */}
                    <div style={{ marginTop: 16, textAlign: "center" }}>
                      {qrError && (
                        <div
                          style={{
                            color: "var(--danger, #f66)",
                            marginBottom: 8,
                          }}
                        >
                          {qrError}
                        </div>
                      )}

                      {qrUrl && (
                        <div
                          className={styles.qrBox}
                          style={{
                            display: "inline-block",
                            padding: 12,
                            borderRadius: 16,
                            border: "1px solid var(--ring)",
                            background:
                              "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12))",
                          }}
                        >
                          <img
                            src={qrUrl}
                            alt="VietQR"
                            width={256}
                            height={256}
                            style={{ display: "block" }}
                          />
                          <div
                            style={{
                              fontSize: 12,
                              opacity: 0.85,
                              marginTop: 8,
                            }}
                          >
                            Quét bằng app ngân hàng để chuyển khoản
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.red} ${styles.wide}`}
                    onClick={handlePayWithBalance}
                    disabled={total <= 0}
                  >
                    Pay
                  </button>
                )}
              </div>
            </aside>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

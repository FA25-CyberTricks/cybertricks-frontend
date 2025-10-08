import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

import styles from "./profile.module.css";
import "../../../../assets/css/user-global.css";

import { useAuth } from "../../../../context/AuthContext";

export default function Profile() {
  const { user: authUser, setUser, setAccessToken } = useAuth();

  const [token, setToken] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // states
  const [bootstrapping, setBootstrapping] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  // headers cho JSON
  const jsonHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  const [profile, setProfile] = useState({
    id: "",
    email: "",
    fullName: "",
    firstName: "",
    lastName: "",
    avatarUrl: "",
    subscriptionType: "",
    subscriptionStartDate: "",
    subscriptionEndDate: "",
    isActive: false,
    createdAt: "",
    updatedAt: "",
    lastLogin: "",
    roles: [],
  });

  // Các field chỉ trên UI
  const [extra, setExtra] = useState({
    birth: "",
    gender: "male",
    phone: "",
    address: "",
  });

  const [pw, setPw] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // === Step 1: đảm bảo có token (refresh bằng HttpOnly cookie) ===
  useEffect(() => {
    let cancelled = false;

    const ensureToken = async () => {
      try {
        const res = await fetch("https://localhost:7229/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setToken(data.token ?? null);
            setAccessToken?.(data.token ?? null);
            if (data.user) setUser?.(data.user);
          }
        } else {
          if (!cancelled) setToken(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Refresh failed:", err);
          setToken(null);
        }
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    };

    ensureToken();
    return () => {
      cancelled = true;
    };
  }, [setAccessToken, setUser]);

  // === Step 2: lấy profile khi đã xong bootstrapping & có token ===
  useEffect(() => {
    if (bootstrapping) return;

    if (!token) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://localhost:7229/api/profile/me", {
          method: "GET",
          headers: jsonHeaders,
          signal: controller.signal,
        });

        if (res.status === 401 || res.status === 403) {
          toast.warn("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          setToken(null);
          setAccessToken?.(null);
          setUser?.(null);
          return;
        }

        if (!res.ok) {
          const json = await safeJson(res);
          toast.error(json?.message || `Request failed (${res.status})`);
          return;
        }

        const data = await res.json();
        setProfile((p) => ({ ...p, ...data }));

        // Đồng bộ một phần lên context (phục vụ header/avatar, v.v.)
        setUser?.((u) => ({
          ...(u || {}),
          id: data.id,
          email: data.email,
          fullName: data.fullName,
          firstName: data.firstName,
          lastName: data.lastName,
          avatarUrl: data.avatarUrl,
          role: data.roles, // giữ nguyên mảng
        }));
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          toast.error("Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    return () => controller.abort();
  }, [bootstrapping, token, jsonHeaders, setUser, setAccessToken]);

  // cleanup preview URL khi unmount hoặc đổi ảnh
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const handleApiError = async (res) => {
    if (res.status === 401 || res.status === 403) {
      toast.warn("Your session has expired. Please log in again..");
      setToken(null);
      setAccessToken?.(null);
      setUser?.(null);
      return;
    }
    const json = await safeJson(res);
    if (json?.message) toast.error(json.message);
    else toast.error(`Request failed (${res.status})`);
  };

  // ===== Handlers =====
  const handleChangeProfile = (field) => (e) => {
    setProfile((p) => ({ ...p, [field]: e.target.value }));
  };

  const handleChangeExtra = (field) => (e) => {
    const value =
      e.target.type === "radio" ? e.target.value : e.target.value ?? "";
    setExtra((x) => ({ ...x, [field]: value }));
  };

  const submitUpdateProfile = async () => {
    if (!token) {
      toast.error("No change yet.");
      return;
    }
    if (updating) return;

    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("FullName", profile.fullName || "");
      formData.append("FirstName", profile.firstName || "");
      formData.append("LastName", profile.lastName || "");
      if (selectedFile) {
        formData.append("avatarFile", selectedFile);
      }

      const res = await fetch("https://localhost:7229/api/profile/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // không set Content-Type ở multipart
        },
        body: formData,
      });

      if (!res.ok) {
        await handleApiError(res);
        return;
      }

      const data = await res.json();
      toast.success("Profile updated successfully.");

      // Nếu BE trả về avatarUrl mới, cập nhật luôn
      if (data.avatarUrl) {
        setProfile((p) => ({ ...p, avatarUrl: data.avatarUrl }));
        if (avatarPreview) URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
        setSelectedFile(null);
      } else {
        // fallback: gọi lại /me
        const refresh = await fetch("https://localhost:7229/api/profile/me", {
          method: "GET",
          headers: jsonHeaders,
        });
        if (refresh.ok) {
          const fresh = await refresh.json();
          setProfile((p) => ({ ...p, ...fresh }));
          if (avatarPreview) URL.revokeObjectURL(avatarPreview);
          setAvatarPreview(null);
          setSelectedFile(null);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePw = (field) => (e) => {
    setPw((s) => ({ ...s, [field]: e.target.value }));
  };

  const canSubmitPw =
    pw.currentPassword.trim().length > 0 &&
    pw.newPassword.trim().length >= 6 &&
    pw.newPassword === pw.confirmPassword;

  const submitChangePassword = async () => {
    if (!token) {
      toast.error("Bạn chưa đăng nhập.");
      return;
    }
    if (!canSubmitPw || changingPw) {
      if (!canSubmitPw) toast.warn("Vui lòng nhập đầy đủ và đúng mật khẩu.");
      return;
    }

    try {
      setChangingPw(true);
      const res = await fetch("https://localhost:7229/api/profile/change-password", {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({
          currentPassword: pw.currentPassword,
          newPassword: pw.newPassword,
          confirmPassword: pw.confirmPassword,
        }),
      });

      if (!res.ok) {
        await handleApiError(res);
        return;
      }

      toast.success("Đổi mật khẩu thành công.");
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      toast.error("Đổi mật khẩu thất bại. Vui lòng thử lại.");
    } finally {
      setChangingPw(false);
    }
  };

  // Tên hiển thị an toàn
  const displayName = (() => {
    const f = profile.firstName ?? authUser?.firstName ?? "";
    const l = profile.lastName ?? authUser?.lastName ?? "";
    const t = `${f} ${l}`.trim();
    return t.length ? t : "—";
  })();

  const avatarBg = avatarPreview ?? profile.avatarUrl ?? "";

  return (
    <>
      <div className="bg-gradient"></div>

      <Header />
      <main className="container" style={{ padding: "100px 0px 50px 0px" }}>
        <h1 className={styles["page-title"]}>Profile</h1>

        {bootstrapping || loading ? (
          <div style={{ opacity: 0.8 }}>Loading profile…</div>
        ) : (
          <>
            {/* Profile Grid */}
            <section className={styles["profile-grid"]}>
              {/* Left: Avatar */}
              <div className={styles.left}>
                <div className={styles["avatar-card"]}>
                  <div
                    className={styles.avatar}
                    style={{
                      backgroundImage: avatarBg ? `url('${avatarBg}')` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {!avatarBg && (
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4" fill="currentColor" />
                        <path
                          d="M4 20c0-4 4-6 8-6s8 2 8 6"
                          fill="currentColor"
                        />
                      </svg>
                    )}

                    {/* hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setSelectedFile(file);

                        const url = URL.createObjectURL(file);
                        if (avatarPreview) URL.revokeObjectURL(avatarPreview);
                        setAvatarPreview(url);
                      }}
                    />

                    <button
                      className={styles["add-btn"]}
                      type="button"
                      title="Choose avatar image"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={updating}
                    >
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className={styles["avatar-name"]}>{displayName}</div>
                </div>
              </div>

              {/* Middle: User info */}
              <div className={styles.middle}>
                <form
                  className={styles["info-form"]}
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitUpdateProfile();
                  }}
                >
                  <div className={`${styles.frow} ${styles.two}`}>
                    <input
                      placeholder="First name"
                      value={profile.firstName || ""}
                      onChange={handleChangeProfile("firstName")}
                    />
                    <input
                      placeholder="Last name"
                      value={profile.lastName || ""}
                      onChange={handleChangeProfile("lastName")}
                    />
                  </div>

                  <div className={`${styles.frow} ${styles.two}`}>
                    <input
                      placeholder="Birth"
                      value={extra.birth}
                      onChange={handleChangeExtra("birth")}
                    />
                    <div className={styles.gender}>
                      <span>Gender:</span>
                      <label>
                        <input
                          type="radio"
                          name="g"
                          value="male"
                          checked={extra.gender === "male"}
                          onChange={handleChangeExtra("gender")}
                        />{" "}
                        Male
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="g"
                          value="female"
                          checked={extra.gender === "female"}
                          onChange={handleChangeExtra("gender")}
                        />{" "}
                        Female
                      </label>
                    </div>
                  </div>

                  <div className={styles.frow}>
                    <input
                      placeholder="Your email"
                      value={profile.email || ""}
                      readOnly
                      title="Email cannot be changed here"
                    />
                  </div>

                  <div className={styles.frow}>
                    <input
                      placeholder="Phone number"
                      value={extra.phone}
                      onChange={handleChangeExtra("phone")}
                    />
                  </div>
                  <div className={styles.frow}>
                    <input
                      placeholder="Address"
                      value={extra.address}
                      onChange={handleChangeExtra("address")}
                    />
                  </div>

                  <button
                    className={`${styles.btn} ${styles.red} ${styles.wide}`}
                    type="submit"
                    disabled={updating}
                  >
                    {updating ? "Updating…" : "Update profile"}
                  </button>
                </form>
              </div>

              {/* Right: Password */}
              <aside className={styles.right}>
                <div className={styles["pw-box"]}>
                  <h3>Change password:</h3>
                  <input
                    type="password"
                    placeholder="Current password"
                    value={pw.currentPassword}
                    onChange={handleChangePw("currentPassword")}
                  />
                  <input
                    type="password"
                    placeholder="New password (≥ 6 ký tự)"
                    value={pw.newPassword}
                    onChange={handleChangePw("newPassword")}
                  />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={pw.confirmPassword}
                    onChange={handleChangePw("confirmPassword")}
                  />
                  <button
                    className={`${styles.btn} ${styles.red} ${styles.wide}`}
                    type="button"
                    onClick={submitChangePassword}
                    disabled={!canSubmitPw || changingPw}
                    title={!canSubmitPw ? "Điền đủ và đúng mật khẩu" : ""}
                  >
                    {changingPw ? "Changing…" : "Change"}
                  </button>
                </div>
              </aside>
            </section>

            {/* Favourites (static sample) */}
            <section className={styles.favs}>
              <h2>My favourites:</h2>
              <ul className={styles["fav-list"]}>
                <li>
                  <span>• CyberCore – Gaming D.C</span>
                  <Link
                    className={`${styles.btn} ${styles.red} ${styles.pill}`}
                    to="/detail/5">
                    Visit
                  </Link>
                </li>
                <li>
                  <span>• CyberCore GIK Town</span>
                  <Link
                    className={`${styles.btn} ${styles.red} ${styles.pill}`}
                    to="/detail/6">
                    Visit
                  </Link>
                </li>
              </ul>
            </section>

            {/* Booking (static sample) */}
            <section className={styles["booking-card"]}>
              <h2>My booking</h2>
              <div className={styles.ticket}>
                <div className={styles["t-left"]}>
                  <h3>CyberCore – Gaming D.C</h3>
                  <p>
                    Toà nhà Xi Grand Court, 258 Lý Thường Kiệt, Phường 14, Quận
                    10, Hồ Chí Minh City, Vietnam
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
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

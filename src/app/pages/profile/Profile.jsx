import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

import styles from "./profile.module.css";
import "../../../assets/css/user-global.css";
import env from "../../config/env";
import { Gender } from "../../../constants/enums";

import { useAuth } from "../../../context/AuthContext";
import FavoritesSection from "./FavoritesSection";
import MyBookingSection from "./MyBookingSection";

export default function Profile() {
  // Lấy token & trạng thái auth từ Context (đÃ refresh ở AuthProvider)
  const {
    user: authUser,
    setUser,
    setAccessToken,
    accessToken,
    loading: authLoading,
  } = useAuth();

  // UI states
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    avatarUrl: "",
  });

  const [extra, setExtra] = useState({
    birth: "", // yyyy-MM-dd
    gender: "", // "male" | "female" | "other"
    phoneNumber: "",
    address: "",
  });

  const [pw, setPw] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Headers JSON có Bearer nếu có accessToken
  const jsonHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    }),
    [accessToken]
  );

  // helpers
  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const handleApiError = async (res) => {
    if (res.status === 401 || res.status === 403) {
      toast.warn("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      setAccessToken?.(null);
      setUser?.(null);
      return;
    }
    const json = await safeJson(res);
    if (json?.message) toast.error(json.message);
    else toast.error(`Request failed (${res.status})`);
  };

  // Lấy profile khi AuthContext đã boot xong và có token
  useEffect(() => {
    if (authLoading) return;

    if (!accessToken) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    // Đặt trong effect để khỏi phải đưa vào dependency array
    const onApiError = async (res) => {
      if (res.status === 401 || res.status === 403) {
        toast.warn("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setAccessToken?.(null);
        setUser?.(null);
        return;
      }
      try {
        const json = await res.json();
        if (json?.message) toast.error(json.message);
        else toast.error(`Request failed (${res.status})`);
      } catch {
        toast.error(`Request failed (${res.status})`);
      }
    };

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${env.BE_ORIGIN}/api/profile/me`, {
          method: "GET",
          headers: jsonHeaders,
          signal: controller.signal,
        });

        if (res.status === 401 || res.status === 403) {
          await onApiError(res);
          return;
        }
        if (!res.ok) {
          await onApiError(res);
          return;
        }

        const data = await res.json();
        setProfile((p) => ({ ...p, ...data }));
        setUser?.((u) => ({
          ...(u || {}),
          id: data.id,
          email: data.email,
          fullName: data.fullName,
          firstName: data.firstName,
          lastName: data.lastName,
          avatarUrl: data.avatarUrl,
          roles: data.roles,
        }));
        setExtra({
          birth: data.birth ?? "",
          gender: data.genderName ?? Gender.Male,
          phoneNumber: data.phoneNumber ?? "",
          address: data.address ?? "",
        });
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
  }, [authLoading, accessToken, jsonHeaders, setUser, setAccessToken]);

  // cleanup preview URL khi unmount/đổi ảnh
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handlers
  const handleChangeProfile = (field) => (e) => {
    setProfile((p) => ({ ...p, [field]: e.target.value }));
  };

  const handleChangeExtra = (field) => (e) => {
    const value =
      e.target.type === "radio" ? e.target.value : e.target.value ?? "";
    setExtra((x) => ({ ...x, [field]: value }));
  };

  const handleChangePw = (field) => (e) => {
    setPw((s) => ({ ...s, [field]: e.target.value }));
  };

  const submitUpdateProfile = async () => {
    if (!accessToken) {
      toast.error("Bạn chưa đăng nhập.");
      return;
    }
    if (updating) return;

    try {
      setUpdating(true);
      const formData = new FormData();
      if (profile.firstName?.trim())
        formData.append("FirstName", profile.firstName.trim());
      if (profile.lastName?.trim())
        formData.append("LastName", profile.lastName.trim());

      if (extra.phoneNumber?.trim())
        formData.append("PhoneNumber", extra.phoneNumber.trim());
      if (extra.address?.trim())
        formData.append("Address", extra.address.trim());
      if (extra.birth?.trim())
        formData.append("DateOfBirth", extra.birth.trim());
      if (extra.gender) formData.append("Gender", extra.gender);
      if (selectedFile) {
        formData.append("avatarFile", selectedFile);
      }

      const res = await fetch(`${env.BE_ORIGIN}/api/profile/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`, // KHÔNG set Content-Type khi dùng FormData
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
        const refresh = await fetch(`${env.BE_ORIGIN}/api/profile/me`, {
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

  const canSubmitPw =
    pw.currentPassword.trim().length > 0 &&
    pw.newPassword.trim().length >= 6 &&
    pw.newPassword === pw.confirmPassword;

  const submitChangePassword = async () => {
    if (!accessToken) {
      toast.error("Bạn chưa đăng nhập.");
      return;
    }
    if (!canSubmitPw || changingPw) {
      if (!canSubmitPw) toast.warn("Vui lòng nhập đầy đủ và đúng mật khẩu.");
      return;
    }

    try {
      setChangingPw(true);
      const res = await fetch(`${env.BE_ORIGIN}/api/profile/change-password`, {
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

        {authLoading || loading ? (
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
                    {" "}
                    <input
                      type="date"
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
                      <label>
                        <input
                          type="radio"
                          name="g"
                          value="other"
                          checked={extra.gender === "other"}
                          onChange={handleChangeExtra("gender")}
                        />{" "}
                        Other
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
                      value={extra.phoneNumber}
                      onChange={handleChangeExtra("phoneNumber")}
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

            <FavoritesSection />
            <MyBookingSection />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

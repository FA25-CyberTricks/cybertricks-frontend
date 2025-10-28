// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import env from "../app/config/env";

const AuthContext = createContext();
const BOOT_KEY = "boot:lock";              // khóa do index.html đặt sớm
const REFRESH_KEY = "auth:refresh:lock";   // khóa refresh trong app
const LOCK_MS = 1500;

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const calledRef = useRef(false);
  const inFlight = useRef(null);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const run = async () => {
      // set khóa refresh ngay khi bắt đầu
      localStorage.setItem(REFRESH_KEY, String(Date.now() + LOCK_MS));

      try {
        if (!inFlight.current) {
          inFlight.current = fetch(`${env.BE_ORIGIN}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
          }).finally(() => { inFlight.current = null; });
        }
        const res = await inFlight.current;
        if (res.ok) {
          let data = {};
          try { data = await res.json(); } catch {}
          setAccessToken(data.token ?? null);
          setUser(data.user ?? null);
        } else {
          setAccessToken(null);
          setUser(null);
        }
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
        setTimeout(() => {
          const u = Number(localStorage.getItem(REFRESH_KEY) || 0);
          if (u <= Date.now()) localStorage.removeItem(REFRESH_KEY);
        }, LOCK_MS);
      }
    };

    // nếu còn lock (từ boot hoặc từ refresh trước), chờ hết rồi mới chạy
    const now = Date.now();
    const bootUntil = Number(localStorage.getItem(BOOT_KEY) || 0);
    const refreshUntil = Number(localStorage.getItem(REFRESH_KEY) || 0);
    const until = Math.max(bootUntil, refreshUntil);

    if (until > now) {
      const id = setTimeout(run, until - now);
      return () => clearTimeout(id);
    }

    run();
  }, []);

  if (loading) {
    return (
      <div style={{
        height: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: 18, fontWeight: 500
      }}>
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // để chặn UI render sớm

  // 🟢 Khi App mount (F5), gọi auto refresh
  useEffect(() => {
    const refreshToken = async () => {
      try {
        const res = await fetch("https://localhost:7229/api/auth/refresh", {
          method: "POST",
          credentials: "include", // 👈 để browser gửi kèm cookie HttpOnly
        });

        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.token);
          if (data.user) {
            setUser(data.user); // BE đã trả user đầy đủ
          }
        } else {
          setAccessToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error("Refresh failed:", err);
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    refreshToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook tiện lợi
export const useAuth = () => useContext(AuthContext);

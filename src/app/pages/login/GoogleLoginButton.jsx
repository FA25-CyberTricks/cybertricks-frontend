// src/components/auth/GoogleLoginButton.jsx
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import env from "../../config/env";

export default function GoogleLoginButton({ className, navigate }) {
  const { setAccessToken, setUser } = useAuth();

  const FE_ORIGIN = env.FE_ORIGIN;
  const BE_ORIGIN = env.BE_ORIGIN;
  const BE_ORIGIN_ONLY = new URL(BE_ORIGIN).origin;

  const handleGoogleLogin = () => {
    const returnUrl =
      new URLSearchParams(window.location.search).get("returnUrl") || "/";

    const width = 500,
      height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const url =
      `${BE_ORIGIN}/api/auth/google-login` +
      `?returnUrl=${encodeURIComponent(returnUrl)}` +
      `&opener=${encodeURIComponent(FE_ORIGIN)}`;

    const popup = window.open(
      url,
      "googleLogin",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      toast.error("Popup bị chặn. Hãy cho phép popup cho trang này.");
      return;
    }

    // Xử lý message trả về từ popup
    function onMessage(e) {
      if (e.origin !== BE_ORIGIN_ONLY) return;
      if (e.source !== popup) return;

      try {
        const data = e.data;
        if (data?.token) {
          setAccessToken(data.token);
          if (data.user) setUser(data.user);
          toast.success("Google login success!");

          // 👇 dùng navigate từ component cha (Login.jsx)
          if (navigate) navigate(data.returnUrl || "/");
        } else if (data?.error) {
          toast.error("Google login failed: " + data.error);
        }
      } finally {
        window.removeEventListener("message", onMessage);
        if (!popup.closed) popup.close();
      }
    }

    window.addEventListener("message", onMessage, { once: true });

    // Dọn dẹp listener khi popup bị đóng thủ công
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        window.removeEventListener("message", onMessage);
      }
    }, 500);
  };

  return (
    <button className={className} type="button" onClick={handleGoogleLogin}>
      <img
        src="assets/images/google-logo.png"
        alt="Google"
        style={{ width: 40, height: 40 }}
      />
      Continue with Google
    </button>
  );
}

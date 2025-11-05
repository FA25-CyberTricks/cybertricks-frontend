import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./app/pages/home/Home";
import Login from "./app/pages/login/Login";
import Register from "./app/pages/login/Register";
import Profile from "./app/pages/profile/Profile";
import Faq from "./app/pages/faq/Faq";
import Browse from "./app/pages/browse/Browse";
import Detail from "./app/pages/detail/Detail";
import Payment from "./app/pages/payment/Payment";

import ProtectedRoute from "./components/ProtectedRoute";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/browse" element={<Browse />} />

         {/* protected route */}
          <Route
            path="/detail/:shopId"
            element={
              <ProtectedRoute>
                <Detail />
              </ProtectedRoute>
            }
          />


          {/* protected route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment/:shopId"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* toast message */}
        <ToastContainer
          position="top-right" // vẫn cần một vị trí hợp lệ
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          style={{
            top: "75%", // dịch xuống 3/4 màn hình
            transform: "translateY(-50%)", // căn giữa chính xác theo trục Y
          }}
        />

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

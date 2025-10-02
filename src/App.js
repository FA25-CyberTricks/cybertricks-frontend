import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./app/user/pages/home/Home";
import Login from "./app/user/pages/login/Login";
import Register from "./app/user/pages/login/Register";
import Profile from "./app/user/pages/profile/Profile";
import Faq from "./app/user/pages/faq/Faq";
import Browse from "./app/user/pages/browse/Browse";
import Detail from "./app/user/pages/detail/Detail";
import Payment from "./app/user/pages/payment/Payment";

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
          <Route path="/detail/:shopId" element={<Detail />} />

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
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import Header from "./app/user/layouts/Header";
import Footer from "./app/user/layouts/Footer";
import Home from "./app/user/pages/home/Home";

// (tuỳ chọn) nếu muốn global riêng cho role user, import ở đây:
// import "./app/user/user-global.css";

export default function App() {
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
}


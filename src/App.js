import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoHomeFill } from "react-icons/go";
import { IoSearch, IoChatbubblesOutline } from "react-icons/io5";
import { getCurrentUser } from "./lib/api";
import Sidebar from "./components/Sidebar";
import { initSocket } from "./lib/socket";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";

function AppLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
useEffect(() => {
  if (user) {
    const token = localStorage.getItem("token");
    initSocket(token);
  }
}, [user]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchUser() {
      try {
        const data = await getCurrentUser(token);
        setUser(data);
      } catch (err) {
        console.error("Lỗi khi lấy user:", err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p className="text-center mt-5">Đang tải...</p>;

  return (
    <div className="container-fluid p-0">
  <div className="row g-0">
    {/* Sidebar desktop */}
    <div className="col-md-3 col-lg-2 d-none d-md-block">
      <Sidebar user={user} onLogout={handleLogout} />
    </div>

    {/* Nội dung chính */}
    <div className="col-12 col-md-9 col-lg-10 ps-md-4" style={{ minHeight: "100vh" }}>
      <Routes>
        <Route path="/home" element={<Home user={user} />} />
        <Route path="/search" element={<Search />} />
        <Route path="/chat" element={<Chat currentUser={user} />} />
        <Route path="/chat/:id" element={<Chat currentUser={user} />} />
        <Route path="/profile/:username" element={<Profile user={user} />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </div>

    {/* Mobile bottom nav */}
    <div className="d-md-none fixed-bottom bg-white border-top py-2">
      <div className="d-flex justify-content-around align-items-center">
        <NavLink to="/home"><GoHomeFill size={22} /></NavLink>
        <NavLink to="/search"><IoSearch size={22} /></NavLink>
        <NavLink to="/chat"><IoChatbubblesOutline size={22} /></NavLink>
        <NavLink to={`/profile/${user?.username}`}>
          <img
            src={user?.profilePic || "/default-avatar.jpg"}
            alt="profile"
            className="rounded-circle"
            style={{ width: 25, height: 25, objectFit: "cover" }}
          />
        </NavLink>
      </div>
    </div>
  </div>
</div>

  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth pages không có layout */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* Các trang chính có layout */}
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </Router>
  );
}

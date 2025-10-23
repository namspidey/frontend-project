import React from "react";
import { GoHomeFill } from "react-icons/go";
import { IoSearch, IoChatbubblesOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Sidebar({ user, onLogout }) {
  const menuItems = [
    { label: "Trang chủ", icon: <GoHomeFill size={20} />, path: "/home" },
    { label: "Tìm kiếm", icon: <IoSearch size={20} />, path: "/search" },
    { label: "Chat", icon: <IoChatbubblesOutline size={20} />, path: "/chat" },
  ];

  return (
    <div
      className="d-flex flex-column justify-content-between p-3 bg-white border-end shadow-sm"
      style={{
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <ul className="nav flex-column w-100">
        {menuItems.map((item, i) => (
          <li key={i} className="nav-item mb-2">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `btn w-100 text-start d-flex align-items-center gap-3 ${
                  isActive ? "btn-primary text-white" : "btn-light"
                }`
              }
              style={{
                borderRadius: 12,
                padding: "10px 15px",
                textDecoration: "none",
                transition: ".2s",
              }}
            >
              {item.icon}
              <span className="fw-semibold">{item.label}</span>
            </NavLink>
          </li>
        ))}

        <li className="nav-item mt-3">
          <NavLink
            to={`/profile/${user?.username}`}
            className={({ isActive }) =>
              `btn w-100 text-start d-flex align-items-center gap-3 ${
                isActive ? "btn-primary text-white" : "btn-light"
              }`
            }
            style={{
              borderRadius: 12,
              padding: "10px 15px",
              textDecoration: "none",
              transition: ".2s",
            }}
          >
            <img
              src={user?.profilePic || "/default-avatar.jpg"}
              alt="avatar"
              style={{
                width: 35,
                height: 35,
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid #ccc",
              }}
            />
            <span>{user?.fullname || "Profile"}</span>
          </NavLink>
        </li>
      </ul>

      <button
        onClick={onLogout}
        className="btn btn-outline-danger mt-auto w-100"
        style={{ borderRadius: 10 }}
      >
        Đăng xuất
      </button>
    </div>
  );
}

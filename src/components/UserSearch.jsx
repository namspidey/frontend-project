import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserSearch({ profilePic, username, fullname, size = 48 }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <div
      onClick={handleClick}
      className="d-flex align-items-center p-2 rounded-3 shadow-sm bg-white hover-shadow-sm"
      style={{
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8f9fa")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
    >
      <img
        src={profilePic || "/default-avatar.jpg"}
        alt={username}
        className="rounded-circle me-3"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: "cover",
          border: "1px solid #ddd",
        }}
      />

      <div className="d-flex flex-column justify-content-center">
        <strong style={{ fontSize: "15px" }}>{username || "Người dùng"}</strong>
        <span style={{ fontSize: "13px", color: "#666" }}>{fullname || ""}</span>
      </div>
    </div>
  );
}

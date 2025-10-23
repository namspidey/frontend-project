import React from "react";
import { useNavigate } from "react-router-dom";
export default function UserInfo({ profilePic, username, size = 40 }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (username) {
      navigate(`/profile/${username}`);
    }
  };
  return (
    <div className="d-flex align-items-center"
    style={{ cursor: "pointer" }}
      onClick={handleClick}>
      <img
        src={profilePic || "/default-avatar.jpg"}
        
        className="rounded-circle me-2"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: "cover",
          border: "2px solid #ddd",
        }}
      />
      <strong className=" mb-0">{username || "Người dùng"}</strong>
    </div>
  );
}

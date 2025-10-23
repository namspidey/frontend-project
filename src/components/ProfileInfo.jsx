import React, { useState } from "react";
import { followUser, unfollowUser } from "../lib/api";
import { IoMdSettings } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileInfo({
  profilePic,
  fullname,
  bio,
  postsCount,
  followersCount,
  followingCount,
  username,
  userId,
  isCurrentUser,
  isFollowingInitial,
}) {
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);
  const [followers, setFollowers] = useState(followersCount);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFollow = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isFollowing) {
        await unfollowUser(userId);
        setIsFollowing(false);
        setFollowers((prev) => prev - 1);
      } else {
        await followUser(userId);
        setIsFollowing(true);
        setFollowers((prev) => prev + 1);
      }
    } catch (err) {
      console.error("❌ Follow toggle error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // 🔹 Xóa token hoặc session
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    // 🔹 Điều hướng về trang login
    navigate("/login");
  };

  return (
    <div className="d-flex align-items-start flex-wrap gap-4">
      {/* Ảnh đại diện bên trái */}
      <img
        src={profilePic || "/default-avatar.jpg"}
        alt={fullname}
        className="rounded-circle border"
        style={{ width: 150, height: 150, objectFit: "cover" }}
      />

      {/* Thông tin bên phải */}
      <div className="ms-2 flex-grow-1">
        <h4 className="mb-1">{username}</h4>
        <p className="text-muted mb-2">{fullname}</p>

        <div className="d-flex align-items-center gap-4 mb-3 flex-wrap">
          <div className="d-flex align-items-center">
            <strong>{postsCount}</strong>
            <div className="text-muted small ms-1">Bài viết</div>
          </div>
          <div className="d-flex align-items-center">
            <strong>{followers}</strong>
            <div className="text-muted small ms-1">Người theo dõi</div>
          </div>
          <div className="d-flex align-items-center">
            <strong>{followingCount}</strong>
            <div className="text-muted small ms-1">Đang theo dõi</div>
          </div>
        </div>

        <p className="text-muted mb-3">{bio}</p>

        {isCurrentUser ? (
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-outline-primary d-flex align-items-center gap-2 px-3 py-1">
              <IoMdSettings size={20} />
              <span>Chỉnh sửa trang cá nhân</span>
            </button>

            <button
              className="btn btn-outline-danger px-3 py-1"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <button
              className={`btn ${
                isFollowing ? "btn-outline-danger" : "btn-primary"
              }`}
              onClick={handleFollow}
              disabled={loading}
            >
              {loading
                ? "Đang xử lý..."
                : isFollowing
                ? "Bỏ theo dõi"
                : "Theo dõi"}
            </button>

            {/* 👉 Nút nhắn tin */}
            <Link to={`/chat/${userId}`}>
              <button className="btn btn-outline-secondary">Nhắn tin</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

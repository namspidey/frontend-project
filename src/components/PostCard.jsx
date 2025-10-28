import React, { useState, useEffect } from "react";
import UserInfo from "./UserInfo";
import PostDetailModal from "./PostDetailModal";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa";
import { likePost, unlikePost } from "../lib/api";

export default function PostCard({ post, user }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [showDetail, setShowDetail] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLiked(post.likes.includes(user?._id));
  }, [user, post.likes]);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1));

  const handleNext = () =>
    setCurrentIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1));

  const handleLikeToggle = async () => {
    try {
      if (liked) {
        await unlikePost(post._id, token);
        setLikeCount((prev) => prev - 1);
      } else {
        await likePost(post._id, token);
        setLikeCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Lỗi khi like/unlike:", error);
    }
  };

  return (
    <div className="card mb-4 shadow-sm  overflow-hidden "
      style={{
        borderRadius: "8px",
        border: "1px solid #ccc"
      }}>
      <div className="card-body p-0">
        {/* Header */}
        <div className="p-3 border-bottom bg-white">
          <UserInfo
            profilePic={post.user?.profilePic}
            username={post.user?.username}
          />
        </div>

        {/* Image */}
        {post.images?.length > 0 && (
          <div className="position-relative text-center bg-black">
            <img
              src={post.images[currentIndex]}
              alt={`post-${currentIndex}`}
              className="img-fluid w-100"
              style={{ objectFit: "contain", maxHeight: "500px" }}
            />
            {post.images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="btn btn-dark position-absolute top-50 start-0 translate-middle-y opacity-75"
                >
                  ‹
                </button>
                <button
                  onClick={handleNext}
                  className="btn btn-dark position-absolute top-50 end-0 translate-middle-y opacity-75"
                >
                  ›
                </button>
              </>
            )}
          </div>
        )}

        {/* Caption */}
        <div className="p-3">
          {post.caption && <p className="mb-2">{post.caption}</p>}

          {/* Actions */}
          <div className="d-flex align-items-center gap-4 mt-2">
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={handleLikeToggle}
                className={`btn btn-link p-0 border-0 fs-4 ${liked ? "text-danger" : "text-secondary"
                  }`}
              >
                {liked ? <FaHeart /> : <FaRegHeart />}
              </button>
              <span className="fw-semibold">{likeCount}</span>
            </div>

            <button
              className="btn btn-link p-0 border-0 text-secondary fs-4"
              onClick={() => setShowDetail(true)}
            >
              <FaRegComment />
            </button>
          </div>

          {/* Date */}
          <p className="text-muted small mt-2 mb-0">
            {new Date(post.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>

      {showDetail && (
        <PostDetailModal
          post={post}
          currentUser={user}
          onClose={() => setShowDetail(false)}
          onCommentAdded={(newComment) => {
            post.comments = [newComment, ...post.comments];
          }}
        />
      )}
    </div>
  );
}

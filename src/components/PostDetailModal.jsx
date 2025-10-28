import React, { useState } from "react";
import UserInfo from "./UserInfo";
import { IoClose, IoSend } from "react-icons/io5";
import { createComment } from "../lib/api";

export default function PostDetailModal({
  post,
  currentUser,
  onClose,
  onCommentAdded,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comments, setComments] = useState(post.comments || []);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1));

  const handleNext = () =>
    setCurrentIndex((prev) =>
      prev === post.images.length - 1 ? 0 : prev + 1
    );

  const handleAddComment = async (e) => {
    e.preventDefault();
    const content = e.target.comment.value.trim();
    if (!content) return;
    try {
      const res = await createComment(post._id, content);
      const newComment = { ...res.comment, user: currentUser };
      setComments((prev) => [newComment, ...prev]);
      e.target.reset();
      onCommentAdded?.(newComment);
    } catch {
      alert("Không thể gửi bình luận");
    }
  };

  // sizes
  const inputHeight = 64; // px, used for padding-bottom so comments aren't hidden

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        zIndex: 2000,
        padding: 12,
        background: "rgba(0,0,0,0.65)",
      }}
      onClick={(e) => {
        // close when clicking backdrop
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="bg-white rounded-4 shadow-lg d-flex flex-column flex-md-row overflow-hidden position-relative"
        style={{
          width: "100%",
          maxWidth: 1000,
          height: "90vh",
        }}
      >
        {/* Close button (always visible, on top) */}
        <button
          onClick={onClose}
          className="btn btn-light position-absolute"
          style={{
            top: 8,
            right: 8,
            zIndex: 60,
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Đóng"
        >
          <IoClose size={20} />
        </button>

        {/* Left: Image area */}
<div
  className="d-flex align-items-center justify-content-center bg-black position-relative"
  style={{
    flex: 2,
    minHeight: 200,
    maxHeight: "100%",
  }}
>
  <img
    src={post.images[currentIndex]}
    alt={`post-${currentIndex}`}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
    }}
  />

  {post.images.length > 1 && (
    <>
      <button
        onClick={handlePrev}
        className="btn btn-dark position-absolute d-flex align-items-center justify-content-center"
        style={{
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: 36,
          height: 36,
          borderRadius: "50%",
          opacity: 0.85,
        }}
        aria-label="Previous"
      >
        ‹
      </button>

      <button
        onClick={handleNext}
        className="btn btn-dark position-absolute d-flex align-items-center justify-content-center"
        style={{
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: 36,
          height: 36,
          borderRadius: "50%",
          opacity: 0.85,
        }}
        aria-label="Next"
      >
        ›
      </button>
    </>
  )}
</div>


        {/* Right: Comments area */}
        <div
          className="d-flex flex-column bg-white"
          style={{
            flex: 1,
            minWidth: 0,
            // ensure on mobile the comments area is visible and scrollable
            maxHeight: "100%",
          }}
        >
          {/* Header */}
          <div className="p-3 border-bottom">
            <UserInfo
              profilePic={post.user?.profilePic}
              username={post.user?.username}
            />
            {post.caption && (
    <p className="mt-2 mb-0 text-break">{post.caption}</p>
  )}
          </div>

          {/* Comment list - scrollable */}
          <div
            className="flex-grow-1 overflow-auto"
            style={{
              padding: "16px",
              // leave space at bottom for the input so last comments are not hidden
              paddingBottom: inputHeight + 16,
            }}
          >
            {comments.length === 0 ? (
              <p className="text-center text-muted">Chưa có bình luận nào</p>
            ) : (
              comments.map((cmt) => (
                <div key={cmt._id} className="d-flex mb-3">
                  <img
                    src={cmt.user?.profilePic || "/default-avatar.jpg"}
                    alt=""
                    className="rounded-circle me-2"
                    style={{ width: 35, height: 35, objectFit: "cover" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div className="bg-light rounded-3 px-3 py-2">
                      <strong>{cmt.user?.username}</strong> {cmt.content}
                    </div>
                    <div className="text-muted small mt-1">
                      {new Date(cmt.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input (sticky at bottom of right pane) */}
          <div
            className="border-top p-3 bg-white"
            style={{
              position: "sticky",
              bottom: 0,
              zIndex: 40,
              display: "flex",
              alignItems: "center",
              gap: 12,
              height: inputHeight,
            }}
          >
            <img
              src={currentUser?.profilePic || "/default-avatar.jpg"}
              alt=""
              className="rounded-circle"
              style={{ width: 40, height: 40, objectFit: "cover" }}
            />

            <form
              onSubmit={handleAddComment}
              style={{ flex: 1, display: "flex", alignItems: "center" }}
            >
              <input
                name="comment"
                className="form-control rounded-pill pe-5"
                placeholder="Thêm bình luận..."
                style={{ height: 44 }}
                autoComplete="off"
              />
              <button
                type="submit"
                className="btn btn-link text-primary"
                style={{
                  position: "absolute",
                  right: 24,
                  border: "none",
                  background: "none",
                }}
                aria-label="Gửi"
              >
                <IoSend size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

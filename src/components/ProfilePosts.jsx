import React, { useState } from "react";
import PostDetailModal from "./PostDetailModal";

export default function ProfilePosts({ posts, currentUser }) {
  const [selectedPost, setSelectedPost] = useState(null);

  if (!posts || posts.length === 0)
    return <p className="text-center text-muted">Chưa có bài viết nào.</p>;

  return (
    <>
      <div className="row g-3">
        {posts.map((post) => (
          <div key={post._id} className="col-4">
            <div
              className="ratio ratio-1x1"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedPost(post)} // 👈 click để mở modal
            >
              <img
                src={post.images[0]}
                alt="post"
                className="w-100 h-100 object-fit-cover rounded"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 🧩 Hiển thị modal chi tiết bài viết */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          currentUser={currentUser}
          onClose={() => setSelectedPost(null)}
          onCommentAdded={(newComment) => {
            selectedPost.comments = [newComment, ...selectedPost.comments]; // cập nhật tạm local
          }}
        />
      )}
    </>
  );
}

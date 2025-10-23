import { useEffect, useState } from "react";
import { getFeed } from "../lib/api";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";

export default function Home({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const token = localStorage.getItem("token");
        const feedData = await getFeed(token);
        setPosts(feedData);
      } catch (err) {
        console.error("Lỗi khi lấy bài viết:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading)
    return <p className="text-center mt-5 text-muted">Đang tải bài viết...</p>;

  return (
    <div className="container py-4 px-2 px-md-5">
      <div className="mx-auto" style={{ maxWidth: "600px" }}>
        <CreatePost onPostCreated={() => window.location.reload()} />
        {posts.length === 0 ? (
          <p className="text-center mt-4 text-muted">Chưa có bài đăng nào.</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} user={user} />)
        )}
      </div>
    </div>
  );
}

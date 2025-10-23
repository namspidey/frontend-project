import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, getUserPosts } from "../lib/api";
import ProfileInfo from "../components/ProfileInfo";
import ProfilePosts from "../components/ProfilePosts";

export default function Profile({ user }) {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        let profileData;

        if (!username || username === user?.username) {
          profileData = user;
        } else {
          profileData = await getUserProfile(username);
        }

        setProfile(profileData);

        if (profileData?._id) {
          const userPosts = await getUserPosts(profileData._id);
          setPosts(userPosts);
        }
      } catch (err) {
        console.error("Lỗi khi tải profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [username, user]);

  if (loading) return <p className="text-center mt-5">Đang tải trang cá nhân...</p>;
  if (!profile) return <p className="text-center mt-5">Không tìm thấy người dùng</p>;

  return (
    <div className="container py-4">
      <div className="d-flex flex-column align-items-center">
        <ProfileInfo
          profilePic={profile.profilePic}
          fullname={profile.fullname}
          username={profile.username}
          bio={profile.bio}
          postsCount={posts.length}
          followersCount={profile.followers?.length || 0}
          followingCount={profile.following?.length || 0}
          userId={profile._id}
          isCurrentUser={profile._id === user?._id}
          isFollowingInitial={user?.following?.includes(profile._id)}
        />

        <div className="mt-4 w-100">
          <ProfilePosts posts={posts} currentUser={user} />
        </div>
      </div>
    </div>
  );
}

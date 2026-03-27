const BASE_URL = 'https://backend-project-xqjf.onrender.com/api';


// 🔧 Hàm tiện ích lấy header có token (nếu có)
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

// 🔧 Xử lý phản hồi chung
async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// 🧩 API: Đăng nhập
export async function loginUser(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res); // { token, user }
}

// 🧩 API: Lấy user hiện tại
export async function getCurrentUser() {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res); // user object
}

// 🧩 API: Gửi OTP qua email
export async function sendOtpToEmail(form) {
  const res = await fetch(`${BASE_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  return handleResponse(res);
}

// 🧩 API: Đăng ký người dùng
export async function registerUser(data) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getFeed(token) {
  const res = await fetch(`${BASE_URL}/post/feed`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Không thể lấy danh sách bài viết");
  return res.json();
}

export async function likePost(postId, token) {
  const res = await fetch(`${BASE_URL}/post/${postId}/like`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function unlikePost(postId, token) {
  const res = await fetch(`${BASE_URL}/post/${postId}/unlike`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function createPost(formData, token) {
  const res = await fetch(`${BASE_URL}/post`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return handleResponse(res);
}

export async function createComment(postId, content) {
  const res = await fetch(`${BASE_URL}/comment/${postId}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ content }),
  });
  return handleResponse(res);
}

// 👍 Like comment
export async function likeComment(commentId, token) {
  const res = await fetch(`${BASE_URL}/comment/${commentId}/like`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Like comment failed");
  return await res.json();
}

// 👎 Unlike comment
export async function unlikeComment(commentId, token) {
  const res = await fetch(`${BASE_URL}/comment/${commentId}/unlike`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Unlike comment failed");
  return await res.json();
}

export const searchUsers = async (query) => {
  if (!query) return [];

  try {
    const res = await fetch(`${BASE_URL}/user/search?q=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`Lỗi server: ${res.status}`);

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Lỗi khi tìm kiếm người dùng:", err);
    return [];
  }
};

//Profile
export const getUserProfile = async (username) => {
  try {
    const res = await fetch(`${BASE_URL}/user/profile/${username}`);
    if (!res.ok) throw new Error("Không thể lấy thông tin người dùng");
    return await res.json();
  } catch (err) {
    console.error("getUserProfile error:", err);
    throw err;
  }
};

// 🖼️ Lấy danh sách bài viết của user
export const getUserPosts = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/post/user/${userId}`);
    if (!res.ok) throw new Error("Không thể lấy bài viết của người dùng");
    return await res.json();
  } catch (err) {
    console.error("getUserPosts error:", err);
    throw err;
  }
};

//Follow/unfollow
// Theo dõi user
export const followUser = async (userId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/user/${userId}/follow`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Lỗi khi follow người dùng");
  return await res.json();
};

// Bỏ theo dõi user
export const unfollowUser = async (userId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/user/${userId}/unfollow`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Lỗi khi unfollow người dùng");
  return await res.json();
};

// 📩 Lấy danh sách chat (ListChat)
export async function getChatList() {
  const res = await fetch(`${BASE_URL}/chat/list`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Lỗi khi lấy danh sách chat');
  return res.json();
}

// 💬 Lấy tin nhắn giữa mình và người khác
export async function getMessages(otherUserId, page = 1, limit = 20) {
  const res = await fetch(`${BASE_URL}/chat/${otherUserId}?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Lỗi khi lấy tin nhắn');
  return res.json();
}

// 📤 Gửi tin nhắn (text hoặc ảnh)
export async function sendMessage(formData) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ KHÔNG đặt Content-Type, vì trình duyệt tự thêm khi dùng FormData
    },
    body: formData,
  });

  // Nếu server không trả Access-Control-Allow-Origin
  // thì lỗi CORS sẽ xuất hiện trước khi code này chạy.
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gửi tin nhắn thất bại: ${errText}`);
  }

  return await res.json();
}

// 👁️ Đánh dấu tin nhắn là đã xem
export async function markMessagesAsSeen(otherUserId) {
  const res = await fetch(`${BASE_URL}/chat/seen/${otherUserId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Lỗi khi đánh dấu đã xem');
  return res.json();
}

export async function getUserById(userId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Không lấy được thông tin user");
  return await res.json();
}

export async function uploadProfilePic(file) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${BASE_URL}/user/upload-avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Tải ảnh thất bại. Vui lòng thử lại");
  return await res.json();
}

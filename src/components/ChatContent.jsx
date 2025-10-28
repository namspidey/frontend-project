import React, { useEffect, useState, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { getMessages, sendMessage } from "../lib/api";
import { getSocket } from "../lib/socket";
import { IoMdPhotos } from "react-icons/io";
export default function ChatContent({ selectedUser, currentUser, onMessageUpdate }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [image, setImage] = useState(null);
  const messagesEndRef = useRef(null);

  // 🟢 Khi đổi người chat → load tin nhắn
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await getMessages(selectedUser.id);
        setMessages(res.messages.reverse());
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (err) {
        console.error("Lỗi khi lấy tin nhắn:", err);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // 🟢 Lắng nghe realtime tin nhắn mới (và cleanup listener cũ)
  useEffect(() => {
    if (!selectedUser) return;
    const socket = getSocket();

    const handleMessage = (msg) => {
      // Nếu tin nhắn thuộc cuộc trò chuyện hiện tại
      if (
        selectedUser &&
        (msg.sender._id === selectedUser.id || msg.receiver === selectedUser.id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
      onMessageUpdate?.(); // luôn reload danh sách chat bên phải
    };

    socket?.on("messageReceived", handleMessage);

    // 🧹 Cleanup: gỡ listener khi đổi người chat hoặc component unmount
    return () => {
      socket?.off("messageReceived", handleMessage);
    };
  }, [selectedUser, onMessageUpdate]);

  // 🟢 Khi có tin nhắn mới → scroll xuống cuối
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🟢 Gửi tin nhắn
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() && !image) return;

    const formData = new FormData();
    formData.append("receiverId", selectedUser.id);
    if (newMsg.trim()) formData.append("content", newMsg);
    if (image) formData.append("image", image);

    try {
      const res = await sendMessage(formData);
      setMessages((prev) => [...prev, res.data]);
      setNewMsg("");
      setImage(null);
      onMessageUpdate?.();
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
    }
  };

  // 🟢 Nếu chưa chọn người
  if (!selectedUser)
    return (
      <div className="d-flex justify-content-center align-items-center h-100 text-muted">
        Chọn người để bắt đầu trò chuyện
      </div>
    );

  return (
    <div className="d-flex flex-column h-100" style={{ position: "relative" }}>
      {/* Header */}
      <div className="d-flex align-items-center border-bottom p-3 bg-white flex-shrink-0">
        <img
          src={selectedUser.profilePic || "/default-avatar.jpg"}
          alt="ava"
          className="rounded-circle me-3"
          style={{ width: 45, height: 45, objectFit: "cover" }}
        />
        <div>
          <strong>{selectedUser.fullname}</strong>
        </div>
      </div>

      {/* Chat body */}
      <div
        className="flex-grow-1 overflow-auto p-3"
        style={{
          background: "#f9f9f9",
          height: "calc(100vh - 140px)",
          overflowY: "auto",
          paddingBottom: window.innerWidth < 768 ? "100px" : "20px", // ✅ chừa chỗ cho bottom nav mobile
        }}
      >
        {messages.map((msg, index) => {
          const fromMe =
            msg.sender?._id === currentUser._id || msg.sender === currentUser._id;
          return (
            <div
              key={index}
              className={`d-flex mb-2 ${fromMe ? "justify-content-end" : "justify-content-start"
                }`}
            >
              <div
                className={`px-3 py-2 rounded-3 ${fromMe ? "bg-primary text-white" : "bg-white border"
                  }`}
                style={{ maxWidth: "60%" }}
              >
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt="img"
                    style={{ maxWidth: "100%", borderRadius: "10px" }}
                  />
                ) : (
                  msg.content
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>
      {image && (
        <div className="p-2 border-top bg-white text-center">
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            style={{
              maxWidth: "150px",
              maxHeight: "150px",
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
          <button
            type="button"
            className="btn btn-sm btn-link text-danger d-block mt-1"
            onClick={() => setImage(null)}
          >
            Xóa ảnh
          </button>
        </div>
      )}
      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="chat-input-bar d-flex align-items-center border-top bg-white p-3 flex-shrink-0"
        style={{
          position: "sticky",
          bottom: 0,
          zIndex: 1050,
        }}
      >
        <label
          className="btn btn-light me-2 mb-0 d-flex align-items-center justify-content-center"
          style={{ borderRadius: "12px", width: "40px", height: "40px" }}
        >
          <IoMdPhotos size={22} />
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <input
          type="text"
          className="form-control rounded-pill me-2"
          placeholder="Nhập tin nhắn..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button type="submit" className="btn btn-primary rounded-circle">
          <IoSend size={20} />
        </button>
      </form>

    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatContent from "../components/ChatContent";
import ListChat from "../components/ListChat";
import { getChatList, getUserById } from "../lib/api";
import { IoArrowBack } from "react-icons/io5";

export default function Chat({ currentUser }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Load danh sách chat
  const reloadChatList = async () => {
    try {
      const data = await getChatList();
      setChatList(data);
    } catch (err) {
      console.error("Lỗi khi reload danh sách chat:", err);
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getChatList();
        setChatList(data);

        if (id) {
          let user = data.find((c) => c.user.id === id)?.user;

          if (!user) {
            try {
              user = await getUserById(id);
            } catch (err) {
              console.error("Không tìm thấy user:", err);
            }
          }

          if (user) {
            setSelectedUser({
              ...user,
              id: user.id || user._id,
            });
          }
        } else {
          setSelectedUser(null);
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách chat:", err);
      }
    };

    fetchChats();
  }, [id, refreshFlag]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    navigate(`/chat/${user.id}`);
  };

  const handleBack = () => {
    navigate("/chat");
    setSelectedUser(null);
  };

  return (
    <div
      className="container-fluid h-100 p-0"
      style={{
        height: "100vh",
        overflow: "hidden",
        paddingBottom: "60px", // tránh bị che bởi navbar
      }}
    >
      {/* Desktop layout */}
      <div className="row h-100 shadow rounded-4 overflow-hidden d-none d-md-flex">
        <div className="col-8 bg-white p-0 border-end">
          <ChatContent
            selectedUser={selectedUser}
            currentUser={currentUser}
            onMessageUpdate={() => setRefreshFlag((prev) => !prev)}
          />
        </div>

        <div className="col-4 bg-light p-0">
          <ListChat
            onSelectUser={handleSelectUser}
            currentUser={currentUser}
            chatList={chatList}
          />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="d-md-none h-100 position-relative">
        {!selectedUser ? (
          <ListChat
            onSelectUser={handleSelectUser}
            currentUser={currentUser}
            chatList={chatList}
          />
        ) : (
          <div className="h-100 bg-white position-relative">
            {/* Nút back */}
            <div
              className="position-absolute top-0 start-0 p-2 z-10"
              style={{
                background: "rgba(255,255,255,0.8)",
                borderBottomRightRadius: "12px",
              }}
            >
              <button
                onClick={handleBack}
                className="btn btn-light btn-sm rounded-circle shadow-sm"
              >
                <IoArrowBack size={20} />
              </button>
            </div>

            <ChatContent
              selectedUser={selectedUser}
              currentUser={currentUser}
              onMessageUpdate={() => setRefreshFlag((prev) => !prev)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

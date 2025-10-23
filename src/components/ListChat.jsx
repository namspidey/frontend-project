export default function ListChat({ onSelectUser, currentUser, chatList }) {
  return (
    <div className="h-100 overflow-auto">
      <div className="border-bottom p-3 bg-white">
        <h5 className="mb-0">Tin nhắn</h5>
      </div>

      {chatList.length === 0 && (
        <div className="text-center text-muted mt-4">
          Chưa có cuộc trò chuyện nào
        </div>
      )}

      {chatList.map((chat) => {
        const latest = chat.latestMessage;
        const displayContent =
          latest?.sender === currentUser._id
            ? `Bạn: ${latest.content || (latest.image ? "Ảnh..." : "")}`
            : latest?.content || (latest?.image ? "Ảnh..." : "");

        return (
          <div
            key={chat.user.id}
            className="d-flex align-items-center p-3 border-bottom hover-bg-light"
            style={{ cursor: "pointer" }}
            onClick={() => onSelectUser(chat.user)}
          >
            <img
              src={chat.user.profilePic || "/default-avatar.jpg"}
              alt={chat.user.fullname}
              className="rounded-circle me-3"
              style={{ width: 45, height: 45, objectFit: "cover" }}
            />
            <div className="flex-grow-1">
              <div className="fw-bold">{chat.user.fullname}</div>
              <div className="text-muted small text-truncate" style={{ maxWidth: "200px" }}>
                {displayContent}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

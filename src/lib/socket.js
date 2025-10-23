import { io } from "socket.io-client";

const SOCKET_URL = "https://backend-project-xqjf.onrender.com"; // backend đang chạy ở cổng 3001

let socket;

export const initSocket = (token) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("setup", token); // gửi token để join room = userId
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }
  return socket;
};

export const getSocket = () => socket;

import { io } from "socket.io-client";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
console.log("Connecting to:", BACKEND_URL);

export const initSocket = async () => {
  const options = {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    timeout: 10000, 
  };
  return io(BACKEND_URL, options);
};

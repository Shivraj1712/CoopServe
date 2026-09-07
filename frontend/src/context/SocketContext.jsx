import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"]
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("⚡ Connected to CoopServe Socket.io Server:", newSocket.id);
      if (user?.role === "FEDERATION_ADMIN") {
        newSocket.emit("join_admin_room");
      } else if (user?.role === "WORKER" && user.workerProfile?.id) {
        newSocket.emit("join_worker_room", user.workerProfile.id);
      }
    });

    return () => newSocket.close();
  }, [user]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}

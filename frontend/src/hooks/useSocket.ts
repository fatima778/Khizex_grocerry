import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

/**
 * Connects to the backend's Socket.IO server for real-time admin updates
 * (stock changes, low-stock alerts, new orders, order status changes).
 */
export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
}

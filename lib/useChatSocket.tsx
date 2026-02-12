"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { Message } from "@/types/types";

type TypingState = Record<string, boolean>;

export default function useChatSocket(userId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const joinedRooms = useRef<Set<string>>(new Set());
  const typingTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingState>({});

  useEffect(() => {
    if (!userId || socketRef.current) return;

    console.log("⚡ Connecting socket...");

    const socket = io("http://192.168.70.115:4000", {
      autoConnect: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: { userId },
    });

    socketRef.current = socket;

    // Connection events
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      joinedRooms.current.forEach((room) => socket.emit("join-room", room));
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("⚡ Socket connection error:", err.message);
    });

    // Online users
    socket.on("online_users", (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on("typing", ({ userId: typingUser }) => {
      if (!typingUser || typingUser === userId) return;

      setTypingUsers((prev) => ({ ...prev, [typingUser]: true }));

      clearTimeout(typingTimeouts.current[typingUser]);

      typingTimeouts.current[typingUser] = setTimeout(() => {
        setTypingUsers((prev) => {
          const copy = { ...prev };
          delete copy[typingUser];
          return copy;
        });
        delete typingTimeouts.current[typingUser];
      }, 1500);
    });

    socket.on("stop-typing", ({ userId: typingUser }) => {
      if (!typingUser) return;
      setTypingUsers((prev) => {
        const copy = { ...prev };
        delete copy[typingUser];
        return copy;
      });
    });

    // Incoming messages
    socket.on("new-message", (msg: Message) => {
      window.dispatchEvent(new CustomEvent("new_message", { detail: msg }));
    });

    socket.on("messages_read", (data) => {
      window.dispatchEvent(new CustomEvent("messages_read", { detail: data }));
    });
    const timeouts = typingTimeouts.current;
    // Cleanup
    return () => {
      console.log("🔥 Disconnecting socket");
      Object.values(timeouts).forEach(clearTimeout);
      // typingTimeouts.current = {};
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  const joinRoom = useCallback((roomId: string) => {
    if (!socketRef.current) return;
    joinedRooms.current.add(roomId);
    socketRef.current.emit("join-room", roomId);
  }, []);

  const sendMessage = useCallback((roomId: string, content: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("send-message", { roomId, content });
  }, []);

  const sendTyping = useCallback((roomId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("typing", roomId);
  }, []);

  const sendStopTyping = useCallback((roomId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("stop-typing", roomId);
  }, []);

  const markRead = useCallback((roomId: string, messageIds?: string[]) => {
    if (!socketRef.current) return;
    socketRef.current.emit("read-message", { roomId, messageIds });
  }, []);

  return {
    sendMessage,
    sendTyping,
    sendStopTyping,
    markRead,
    joinRoom,
    onlineUsers,
    typingUsers,
  };
}

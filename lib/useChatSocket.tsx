"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { Message } from "@/types/types";

type TypingState = Record<string, boolean>;

export default function useChatSocket(userId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingState>({});
  const typingTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    if (!userId || socketRef.current) return;

    console.log("⚡ Connecting socket...");

    const socket = io("http://localhost:4000", {
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
      // socket.emit("join", userId);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("⚡ Socket connection error:", err.message);
    });

    // Online users
    socket.on("online_users", setOnlineUsers);

    // Typing events
    socket.on("typing", ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => ({ ...prev, [userId]: true }));
      if (typingTimeouts.current[userId])
        clearTimeout(typingTimeouts.current[userId]);

      typingTimeouts.current[userId] = setTimeout(() => {
        setTypingUsers((prev) => {
          const copy = { ...prev };
          delete copy[userId];
          return copy;
        });
        delete typingTimeouts.current[userId];
      }, 1500);
    });

    socket.on("stop-typing", ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => {
        const copy = { ...prev };
        delete copy[userId];
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

    // Cleanup
    return () => {
      console.log("🔥 Disconnecting socket");
      Object.values(typingTimeouts.current).forEach(clearTimeout);
      typingTimeouts.current = {};
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  // Send a message
  // const sendMessage = useCallback(
  //   (conversationId: string, content: string) => {
  //     if (!socketRef.current || !userId) return;
  //     socketRef.current.emit("send_message", {
  //       conversationId,
  //       content,
  //       senderId: userId,
  //     });
  //   },
  //   [userId],
  // );

  const joinRoom = useCallback((roomId: string) => {
    socketRef.current?.emit("join-room", roomId);
  }, []);

  const sendMessage = useCallback((roomId: string, content: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("send-message", { roomId, content });
  }, []);

  // Typing indicator
  // const sendTyping = useCallback(
  //   (conversationId: string) => {
  //     if (!socketRef.current || !userId) return;
  //     socketRef.current.emit("typing", { conversationId, userId });
  //   },
  //   [userId],
  // );
  const sendTyping = useCallback((roomId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("typing", roomId);
  }, []);

  const sendStopTyping = useCallback((roomId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("stop-typing", roomId);
  }, []);

  // Mark messages as read
  // const markRead = useCallback(
  //   (conversationId: string) => {
  //     if (!socketRef.current || !userId) return;
  //     socketRef.current.emit("read_messages", { conversationId, userId });
  //   },
  //   [userId],
  // );

  const markRead = useCallback((roomId: string, messageIds: string[]) => {
    if (!socketRef.current) return;
    socketRef.current.emit("read-message", { roomId, messageIds });
  }, []);

  // return { sendMessage, sendTyping, markRead, onlineUsers, typingUsers };

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

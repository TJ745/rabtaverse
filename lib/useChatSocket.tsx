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

    fetch("/api/socket_io");
    const socket = io("/", {
      path: "/api/socket_io",
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("join", userId);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("online_users", setOnlineUsers);

    socket.on("typing", ({ userId }) => {
      setTypingUsers((p) => ({ ...p, [userId]: true }));
      setTimeout(() => {
        setTypingUsers((p) => {
          const x = { ...p };
          delete x[userId];
          return x;
        });
      }, 1500);
    });

    socket.on("receive_message", (msg: Message) => {
      window.dispatchEvent(new CustomEvent("new_message", { detail: msg }));
    });

    socket.on("messages_read", (data) => {
      window.dispatchEvent(
        new CustomEvent("messages_read", {
          detail: data,
        }),
      );
    });

    return () => {
      console.log("🔥 Closing socket");

      Object.values(typingTimeouts.current).forEach(clearTimeout);
      typingTimeouts.current = {};
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  const sendMessage = useCallback(
    (conversationId: string, content: string) => {
      if (!socketRef.current || !userId) return;
      socketRef.current.emit("send_message", {
        conversationId,
        content,
        senderId: userId,
      });
    },
    [userId],
  );

  const sendTyping = useCallback(
    (conversationId: string) => {
      if (!socketRef.current || !userId) return;
      socketRef.current.emit("typing", { conversationId, userId });
    },
    [userId],
  );

  const markRead = useCallback(
    (conversationId: string) => {
      if (!socketRef.current || !userId) return;
      socketRef.current.emit("read_messages", { conversationId, userId });
    },
    [userId],
  );

  return { sendMessage, sendTyping, markRead, onlineUsers, typingUsers };
}

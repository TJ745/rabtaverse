"use client";

import ChatHeader from "@/components/ChatHeader";
import ChatList from "@/components/ChatList";
import ChatListHeader from "@/components/ChatListHeader";
import ChatSearch from "@/components/ChatSearch";
import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useRef, useState } from "react";
import { getMessages, sendMessage } from "../actions/messages";
import type { Chat, Message } from "@/types/types";
import useChatSocket from "@/lib/useChatSocket";
import { useSession } from "@/lib/auth-client";

export default function Chat() {
  const { data: session } = useSession();

  const userId = session?.user?.id;

  const [activeChat, setActiveChat] = useState<Chat>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");

  const {
    sendMessage: sendMessageSocket,
    sendTyping,
    sendStopTyping,
    markRead,
    joinRoom,
    onlineUsers,
    typingUsers,
  } = useChatSocket(userId);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      const msgs = await getMessages(conversationId);
      setMessages(msgs);
      markRead(conversationId); // Mark messages as read
    },
    [markRead],
  );

  useEffect(() => {
    if (!activeChat?.id) return;

    loadMessages(activeChat.id); // load previous messages
    joinRoom(activeChat.id); // join the socket room
  }, [activeChat?.id, joinRoom, loadMessages]);

  useEffect(() => {
    const handler = (e: CustomEvent<Message>) => {
      const msg = e.detail;
      if (msg.conversationId === activeChat?.id) {
        setMessages((p) => [...p, msg]);
      }
    };

    window.addEventListener("new_message", handler as EventListener);
    return () =>
      window.removeEventListener("new_message", handler as EventListener);
  }, [activeChat?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!activeChat?.id) return;

    // await sendMessage(activeChat.id, text);
    // sendMessageSocket(activeChat.id, text);

    // setMessages((prev) => [
    //   ...prev,
    //   {
    //     id: Date.now().toString(),
    //     conversationId: activeChat.id,
    //     fromMe: true,
    //     text,
    //     time: new Date().toLocaleTimeString([], {
    //       hour: "2-digit",
    //       minute: "2-digit",
    //     }),
    //   },
    // ]);
    const newMsg: Message = {
      id: Date.now().toString(),
      conversationId: activeChat.id,
      fromMe: true,
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);

    // Send to server
    await sendMessage(activeChat.id, text); // API persistence
    sendMessageSocket(activeChat.id, text); // Socket broadcast
  };

  const handleTyping = (text: string) => {
    if (!activeChat?.id) return;
    if (text) sendTyping(activeChat.id);
    else sendStopTyping(activeChat.id);
  };

  return (
    <div className="h-screen w-full flex bg-zinc-900">
      {/* Left Sidebar */}
      <div className="w-[320px] border-r flex flex-col">
        <ChatListHeader />
        <ChatSearch value={search} onChange={setSearch} />
        <Separator />
        {userId && (
          <ChatList
            onSelect={setActiveChat}
            search={search}
            activeId={activeChat?.id}
            userId={userId}
            onlineUsers={onlineUsers}
            typingUsers={typingUsers}
          />
        )}
      </div>

      {/* Right Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader
          chat={activeChat}
          online={
            activeChat
              ? activeChat.members?.some(
                  (m) => m.userId !== userId && onlineUsers.includes(m.userId),
                )
              : false
          }
          typing={
            activeChat
              ? activeChat.members?.some(
                  (m) => m.userId !== userId && typingUsers[m.userId],
                )
              : false
          }
        />
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={messages} />
          <div ref={messagesEndRef} />
        </div>
        <MessageInput onSend={handleSend} onTyping={handleTyping} />
      </div>
    </div>
  );
}

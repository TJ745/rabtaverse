"use client";

import ChatHeader from "@/components/ChatHeader";
import ChatList from "@/components/ChatList";
import ChatListHeader from "@/components/ChatListHeader";
import ChatSearch from "@/components/ChatSearch";
import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useState } from "react";
import { getMessages, sendMessage } from "../actions/messages";
import type { Chat, Message } from "@/types/types";
import useChatSocket from "@/lib/useChatSocket";
import { useSession } from "@/lib/auth-client";

export default function Chat() {
  const { data: session } = useSession();

  const userId = session?.user?.id;

  const [activeChat, setActiveChat] = useState<Chat | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");

  const {
    sendMessage: sendMessageSocket,
    markRead,
    onlineUsers,
    typingUsers,
  } = useChatSocket(userId);

  const loadMessages = useCallback(
    async (id: string) => {
      const msgs = await getMessages(id);
      setMessages(msgs);
      markRead(id); // Mark messages as read
      // joinConversation(conversationId);
    },
    [markRead],
  );

  useEffect(() => {
    if (!activeChat?.id) return;
    loadMessages(activeChat.id);
  }, [activeChat?.id, loadMessages]);

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

  const handleSend = async (text: string) => {
    if (!activeChat?.id) return;

    await sendMessage(activeChat.id, text);
    sendMessageSocket(activeChat.id, text);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        conversationId: activeChat.id,
        fromMe: true,
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <div className="h-screen w-full flex">
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
            onlineUsers={[]}
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
        <MessageList messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}

"use client";

import ChatHeader from "@/components/ChatHeader";
import ChatList from "@/components/ChatList";
import ChatListHeader from "@/components/ChatListHeader";
import ChatSearch from "@/components/ChatSearch";
import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

type Chat = {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
};

type Message = {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
};

// ---------------- Mock Data ----------------

const chats: Chat[] = [
  { id: "1", name: "Ali", lastMessage: "Hey, how are you?" },
  { id: "2", name: "Sara", lastMessage: "Let's meet tomorrow" },
  { id: "3", name: "Team Group", lastMessage: "Meeting at 3 PM" },
];

const initialMessages: Message[] = [
  { id: "1", fromMe: false, text: "Hello!", time: "10:00" },
  { id: "2", fromMe: true, text: "Hi, how are you?", time: "10:01" },
  { id: "3", fromMe: false, text: "I'm good, thanks!", time: "10:02" },
];

export default function Chat() {
  const [activeChat, setActiveChat] = useState<Chat | undefined>(chats[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [search, setSearch] = useState("");

  function handleSend(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), fromMe: true, text, time: "now" },
    ]);
  }

  return (
    <div className="h-screen w-full flex">
      {/* Left Sidebar */}
      <div className="w-[320px] border-r flex flex-col">
        <ChatListHeader />
        <ChatSearch value={search} onChange={setSearch} />
        <Separator />
        <ChatList onSelect={setActiveChat} search={search} />
      </div>

      {/* Right Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader chat={activeChat} />
        <MessageList messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}

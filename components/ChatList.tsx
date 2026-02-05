"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { getChatList } from "@/app/actions/chat";
import FriendRequests from "./FriendRequests";
import type { Chat, ChatMember } from "@/types/types";
// import useChatSocket from "@/lib/useChatSocket";

type ChatListProps = {
  onSelect: (chat: Chat) => void;
  search: string;
  activeId?: string;
  userId: string;
  onlineUsers: string[];
};

export default function ChatList({
  onSelect,
  search,
  activeId,
  userId,
  onlineUsers,
}: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  // const { onlineUsers, typingUsers } = useChatSocket(userId);

  useEffect(() => {
    async function loadChats() {
      const data = await getChatList();
      setChats(data);
      setLoading(false);
    }
    loadChats();
  }, []);

  useEffect(() => {
    const handleNewChat = (e: CustomEvent<Chat>) => {
      setChats((prev) => {
        if (prev.find((c) => c.id === e.detail.id)) return prev;
        return [e.detail, ...prev];
      });
    };

    window.addEventListener("new_chat", handleNewChat as EventListener);
    return () =>
      window.removeEventListener("new_chat", handleNewChat as EventListener);
  }, []);

  const filteredChats = chats.filter((chat) =>
    `${chat.name} ${chat.lastMessage}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Loading chats...
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <FriendRequests />
      {filteredChats.map((chat) => {
        // const otherUserId =
        //   chat.type === "PRIVATE"
        //     ? chat.members?.find((m) => m.id !== userId)?.id
        //     : undefined;

        // const isOnline = otherUserId
        //   ? onlineUsers.includes(otherUserId)
        //   : false;
        // const isTyping = otherUserId ? typingUsers[otherUserId] : false;
        const otherMemberId =
          chat.type === "PRIVATE"
            ? chat.members?.find((m: ChatMember) => m.userId !== userId)?.userId
            : undefined;

        const isOnline = otherMemberId
          ? onlineUsers.includes(otherMemberId)
          : false;
        return (
          <button
            key={chat.id}
            onClick={() => onSelect(chat)}
            className={`w-full flex items-center gap-3 p-3 hover:bg-primary text-left rounded-lg cursor-pointer m-1 ${
              activeId === chat.id ? "bg-primary" : ""
            }`}
          >
            <Avatar>
              <AvatarImage src={chat.avatar || undefined} />
              <AvatarFallback>{chat.name[0].toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <p className="font-medium leading-none text-white">{chat.name}</p>
              <p className="text-sm text-zinc-400 truncate">
                {chat.lastMessage}
              </p>
              {isOnline && (
                <span className="text-xs text-green-400">Online</span>
              )}
            </div>
          </button>
        );
      })}
    </ScrollArea>
  );
}

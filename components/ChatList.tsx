"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { getChatList } from "@/app/actions/chat";
import FriendRequests from "./FriendRequests";

type Chat = {
  id: string;
  name: string;
  avatar?: string | null;
  lastMessage: string;
};

// const chats: Chat[] = [
//   { id: "1", name: "Ali", lastMessage: "Hey, how are you?" },
//   { id: "2", name: "Sara", lastMessage: "Let's meet tomorrow" },
//   { id: "3", name: "Team Group", lastMessage: "Meeting at 3 PM" },
// ];

export default function ChatList({
  onSelect,
  search,
}: {
  onSelect: (chat: Chat) => void;
  search: string;
}) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getChatList();
      setChats(data);
      setLoading(false);
    }

    load();
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
      {filteredChats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onSelect(chat)}
          className="w-full flex items-center gap-3 p-3 hover:bg-primary text-left rounded-lg cursor-pointer m-1"
        >
          <Avatar>
            <AvatarImage src={chat.avatar || undefined} />
            <AvatarFallback>{chat.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <p className="font-medium leading-none text-white">{chat.name}</p>
            <p className="text-sm text-zinc-400 truncate">{chat.lastMessage}</p>
          </div>
        </button>
      ))}
    </ScrollArea>
  );
}

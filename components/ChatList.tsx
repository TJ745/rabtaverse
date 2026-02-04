import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";

type Chat = {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
};

const chats: Chat[] = [
  { id: "1", name: "Ali", lastMessage: "Hey, how are you?" },
  { id: "2", name: "Sara", lastMessage: "Let's meet tomorrow" },
  { id: "3", name: "Team Group", lastMessage: "Meeting at 3 PM" },
];

export default function ChatList({
  onSelect,
  search,
}: {
  onSelect: (chat: Chat) => void;
  search: string;
}) {
  const filteredChats = chats.filter((chat) =>
    `${chat.name} ${chat.lastMessage}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      {filteredChats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onSelect(chat)}
          className="w-full flex items-center gap-3 p-3 hover:bg-primary text-left rounded-lg cursor-pointer m-1"
        >
          <Avatar>
            <AvatarImage src={`https://i.pravatar.cc/150?u=${chat.id}`} />
            <AvatarFallback>{chat.name[0]}</AvatarFallback>
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

import { Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

type Chat = {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
};

export default function ChatHeader({ chat }: { chat?: Chat }) {
  if (!chat)
    return (
      <div className="h-14 border-b flex items-center px-4">Select a chat</div>
    );

  return (
    <div className="h-14 border-b flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={`https://i.pravatar.cc/150?u=${chat.id}`} />
          <AvatarFallback>{chat.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium leading-none text-white">{chat.name}</p>
          <p className="text-xs text-zinc-400">online</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer text-white"
        >
          <Phone className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer text-white"
        >
          <Video className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

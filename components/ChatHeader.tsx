import { Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import type { Chat } from "@/types/types";

type ChatHeaderProps = {
  chat?: Chat;
  online?: boolean;
  typing?: boolean;
  onCall?: () => void;
  onVideoCall?: () => void;
};

export default function ChatHeader({
  chat,
  online = false,
  typing = false,
  onCall,
  onVideoCall,
}: ChatHeaderProps) {
  if (!chat)
    return (
      <div className="h-14 border-b flex items-center px-4 text-zinc-400">
        Select a chat
      </div>
    );

  return (
    <div className="h-14 border-b flex items-center justify-between px-4 bg-zinc-900">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage
            src={chat.avatar || `https://i.pravatar.cc/150?u=${chat.id}`}
          />
          <AvatarFallback>{chat.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium leading-none text-white">{chat.name}</p>
          {typing ? (
            <span className="text-zinc-400 text-xs italic">Typing...</span>
          ) : online ? (
            <span className="text-green-400 text-xs">Online</span>
          ) : (
            <span className="text-zinc-500 text-xs">Offline</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer text-white"
          onClick={onCall}
        >
          <Phone className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer text-white"
          onClick={onVideoCall}
        >
          <Video className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

"use client";
import { Search, UserPlus } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import AddFriendDialog from "./AddFriendModal";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function ChatSearch({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="p-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-9 text-white"
            placeholder="Search chats"
          />
        </div>

        <Button
          size="icon"
          variant="link"
          className="text-white hover:text-zinc-300 cursor-pointer border"
          onClick={() => setOpen(true)}
        >
          <UserPlus className="h-5 w-5" />
        </Button>
      </div>
      <AddFriendDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

"use client";

import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Mic, Paperclip, Send, Smile } from "lucide-react";
import { Input } from "./ui/input";

type MessageInputProps = {
  onSend: (text: string) => void;
  onTyping?: (text: string) => void; // optional typing callback
};

export default function MessageInput({ onSend, onTyping }: MessageInputProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);

    if (onTyping) {
      onTyping(e.target.value); // send typing info to parent
    }

    // Optional: stop typing after 2s of inactivity
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      if (onTyping) onTyping(""); // signal stop typing
    }, 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
    inputRef.current?.focus(); // keep focus after sending
    if (onTyping) onTyping("");
  }

  return (
    <div className="p-3 border-t flex items-center gap-2 bg-zinc-900">
      <Button variant="ghost" size="icon" className="cursor-pointer text-white">
        <Smile className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="cursor-pointer text-white">
        <Paperclip className="h-5 w-5" />
      </Button>

      <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
        <Input
          ref={inputRef}
          value={text}
          onChange={handleChange}
          className="text-white bg-zinc-800 placeholder:text-zinc-500"
          placeholder="Type a message..."
          autoComplete="off"
        />
        <Button type="submit" className="cursor-pointer text-white" size="icon">
          <Send className="h-5 w-5" />
        </Button>
      </form>

      <Button variant="ghost" size="icon" className="cursor-pointer text-white">
        <Mic className="h-5 w-5" />
      </Button>
    </div>
  );
}

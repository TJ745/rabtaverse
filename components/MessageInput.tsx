"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Mic, Paperclip, Send, Smile } from "lucide-react";
import { Input } from "./ui/input";
import dynamic from "next/dynamic";
import { EmojiStyle, Theme, type EmojiClickData } from "emoji-picker-react";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

type MessageInputProps = {
  onSend: (text: string) => void;
  onTyping?: (text: string) => void; // optional typing callback
};

export default function MessageInput({ onSend, onTyping }: MessageInputProps) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  function handleEmojiClick(emojiObject: EmojiClickData) {
    setText((prev) => prev + emojiObject.emoji);
    inputRef.current?.focus();
    if (onTyping) onTyping(text + emojiObject.emoji);
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
      <div className="flex items-center gap-2 mb-1 relative">
        <Button
          variant="link"
          size="icon"
          className="cursor-pointer text-white"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <Smile className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer text-white"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {showEmojiPicker && (
          <div
            ref={pickerRef}
            className="absolute bottom-12.5 left-0 z-50 shadow-xl rounded-xl overflow-hidden border border-zinc-700"
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={Theme.DARK}
              emojiStyle={EmojiStyle.GOOGLE}
              height={320}
              width={300}
              lazyLoadEmojis
              searchDisabled
              skinTonesDisabled
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
      </div>

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

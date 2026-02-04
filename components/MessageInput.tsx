import { useState } from "react";
import { Button } from "./ui/button";
import { Mic, Paperclip, Send, Smile } from "lucide-react";
import { Input } from "./ui/input";

export default function MessageInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");

  return (
    <div className="p-3 border-t flex items-center gap-2">
      <Button variant="ghost" size="icon" className="cursor-pointer text-white">
        <Smile className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="cursor-pointer text-white">
        <Paperclip className="h-5 w-5" />
      </Button>

      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        onKeyDown={(e) => {
          if (e.key === "Enter" && text.trim()) {
            onSend(text);
            setText("");
          }
        }}
        className="text-white"
      />

      <Button
        size="icon"
        onClick={() => {
          if (!text.trim()) return;
          onSend(text);
          setText("");
        }}
        className="cursor-pointer text-white"
      >
        <Send className="h-5 w-5" />
      </Button>

      <Button variant="ghost" size="icon" className="cursor-pointer text-white">
        <Mic className="h-5 w-5" />
      </Button>
    </div>
  );
}

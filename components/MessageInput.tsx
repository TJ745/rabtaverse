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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  }

  return (
    <div className="p-3 border-t flex items-center gap-2">
      <Button variant="ghost" size="icon" className="cursor-pointer text-white">
        <Smile className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="cursor-pointer text-white">
        <Paperclip className="h-5 w-5" />
      </Button>

      <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
        <Input
          value={text}
          onChange={handleChange}
          className="text-white"
          placeholder="Type a message..."
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

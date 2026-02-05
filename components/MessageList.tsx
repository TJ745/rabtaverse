import { Message } from "@/types/types";
import MessageBubble from "./MessageBubble";
import { ScrollArea } from "./ui/scroll-area";

export default function MessageList({ messages }: { messages: Message[] }) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
      </div>
    </ScrollArea>
  );
}

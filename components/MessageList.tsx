import MessageBubble from "./MessageBubble";
import { ScrollArea } from "./ui/scroll-area";

type Message = {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
};

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

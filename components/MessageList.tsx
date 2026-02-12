"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types/types";
import MessageBubble from "./MessageBubble";
import { ScrollArea } from "./ui/scroll-area";

export default function MessageList({ messages }: { messages: Message[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}

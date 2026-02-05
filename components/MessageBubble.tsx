import { Message } from "@/types/types";

export default function MessageBubble({ msg }: { msg: Message }) {
  return (
    <div className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
          msg.fromMe
            ? "bg-teal-900 text-primary-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        <p>{msg.text}</p>
        <p className="text-[10px] opacity-70 text-right mt-1">{msg.time}</p>
      </div>
    </div>
  );
}

import { Message } from "@/types/types";

export default function MessageBubble({ msg }: { msg: Message }) {
  return (
    <div
      className={`flex ${msg.fromMe ? "justify-end" : "justify-start"} px-2`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm wrap-break-word ${
          msg.fromMe
            ? "bg-teal-800 text-primary-foreground hover:bg-teal-700 transition-colors"
            : "bg-zinc-700 text-zinc-100 hover:bg-zinc-600 transition-colors"
        }`}
      >
        <p>{msg.text}</p>
        <p className="text-[10px] opacity-50 text-right mt-1 select-none">
          {msg.time}
        </p>
      </div>
    </div>
  );
}

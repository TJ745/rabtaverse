import { Search } from "lucide-react";
import { Input } from "./ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function ChatSearch({ value, onChange }: Props) {
  return (
    <div className="p-3">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9 text-white"
          placeholder="Search chats"
        />
      </div>
    </div>
  );
}

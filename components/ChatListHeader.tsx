"use client";
import { LogOut, MoreVertical, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ChatListHeader() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?img=32" />
          <AvatarFallback>{session?.user.name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-white">{session?.user.name}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-white cursor-pointer"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer">
            <User /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings /> Settings
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem
            className="hover:text-red-600 cursor-pointer"
            onClick={async () => {
              const result = await signOut();
              if (result.data) {
                router.push("/login");
              } else {
                alert("Error logging out");
              }
            }}
          >
            <LogOut /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

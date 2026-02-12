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
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProfileDialog from "./ProfileModal";
import { useFullSession } from "@/hooks/useFullSession";

export default function ChatListHeader() {
  const session = useFullSession();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const user = session?.user;

  if (!user) return null;

  return (
    <>
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-white">{user.name}</span>
            <span className="font-semibold text-zinc-400 text-xs">
              {user.about}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="link"
              size="icon"
              className="text-white cursor-pointer"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-primary  ">
            <DropdownMenuItem
              className="cursor-pointer hover:bg-zinc-700 text-white"
              onClick={() => setProfileOpen(true)}
            >
              <User className="text-white" /> Profile
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer hover:bg-zinc-700 text-white">
              <Settings className="text-white" /> Settings
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem
              className="hover:text-red-600 cursor-pointer hover:bg-zinc-700 text-white"
              onClick={async () => {
                const result = await signOut();
                if (result.data) {
                  router.push("/login");
                } else {
                  alert("Error logging out");
                }
              }}
            >
              <LogOut className="text-white" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ProfileDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          about: user.about,
        }}
      />
    </>
  );
}

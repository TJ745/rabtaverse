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
import { useState } from "react";
import ProfileDialog from "./ProfileModal";
import { ExtendedUser } from "@/types/types";

export default function ChatListHeader() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  // if (!session?.user) return null;

  const user = session?.user as ExtendedUser | undefined;

  if (!user) return null;

  return (
    <>
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-white">{user.name}</span>
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
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setProfileOpen(true)}
            >
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
      <ProfileDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          about: user.about || null,
        }}
      />
    </>
  );
}

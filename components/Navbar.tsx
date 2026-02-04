"use client";

import { MessagesSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav className="border-b border-gray-200">
      <div className="container mx-auto flex items-center h-16 px-4 justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold text-primary"
        >
          <MessagesSquare />
          RabtaVerse
        </Link>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Link href="/chat">
                <Button variant="ghost">Chat</Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white">
                      {session.user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={async () => {
                      const result = await signOut();
                      if (result.data) {
                        router.push("/login");
                      } else {
                        alert("Error logging out");
                      }
                    }}
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Start for Free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

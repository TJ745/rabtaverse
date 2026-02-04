"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchUsers, sendFriendRequest } from "@/app/actions/friends";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = {
  id: string;
  name: string;
  image?: string | null;
};

export default function AddFriendDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!query) return setUsers([]);

    const t = setTimeout(async () => {
      const res = await searchUsers(query);
      setUsers(res);
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search users by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="space-y-2 max-h-75 overflow-y-auto">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-2 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={u.image || undefined} />
                  <AvatarFallback>{u.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{u.name}</span>
              </div>

              <Button
                size="sm"
                onClick={async () => {
                  const res = await sendFriendRequest(u.id);
                  alert(res?.message);
                }}
              >
                Add
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getFriendRequests, acceptFriendRequest } from "@/app/actions/friends";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FriendRequest } from "@/types/types";

export default function FriendRequests() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const data = await getFriendRequests();
      if (active) {
        setRequests(data);
        setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  if (loading) return null;
  if (!requests.length) return null;

  return (
    <div className="p-3 space-y-2">
      {requests.map((r) => (
        <div
          key={r.id}
          className="flex items-center justify-between border p-2 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={r.sender.image || undefined} />
              <AvatarFallback>{r.sender.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-white">{r.sender.name}</span>
          </div>

          <Button
            size="sm"
            onClick={async () => {
              await acceptFriendRequest(r.id);
              setRequests((prev) => prev.filter((req) => req.id !== r.id));
            }}
            className="cursor-pointer"
          >
            Accept
          </Button>
        </div>
      ))}
    </div>
  );
}

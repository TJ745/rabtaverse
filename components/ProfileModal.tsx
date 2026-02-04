"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    about?: string | null;
  };
};

export default function ProfileDialog({ open, onOpenChange, user }: Props) {
  const [name, setName] = useState(user.name);
  const [about, setAbout] = useState(user.about || "");
  const [image, setImage] = useState(user.image || "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={image || undefined} />
              <AvatarFallback>{name?.[0]}</AvatarFallback>
            </Avatar>

            <Input
              placeholder="Avatar URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <Input value={user.email} readOnly />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm">Username</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* About */}
          <div>
            <label className="text-sm">About</label>
            <Textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Write something about yourself..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

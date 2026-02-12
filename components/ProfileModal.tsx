"use client";

import { useEffect, useState, useTransition } from "react";
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
import { updateProfile } from "@/app/actions/profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    about?: string;
  };
};

export default function ProfileDialog({ open, onOpenChange, user }: Props) {
  const [name, setName] = useState(user.name);
  const [about, setAbout] = useState(user.about || "");
  // const [image, setImage] = useState(user.image || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(user.image || "");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      Promise.resolve().then(() => setPreview(objectUrl));
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      Promise.resolve().then(() => setPreview(user.image || ""));
    }
  }, [file, user.image]);

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    startTransition(async () => {
      try {
        await updateProfile({
          name,
          about,
          file: file ?? undefined,
          image: file ? undefined : user.image,
        });

        toast.success("Profile updated successfully");
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        console.error(err);
        toast.error("Failed to update profile");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={preview || undefined} />
              <AvatarFallback>{name?.[0]}</AvatarFallback>
            </Avatar>

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                } else {
                  setFile(null);
                }
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm">Email</label>
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
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="text-black cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="cursor-pointer border border-white"
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

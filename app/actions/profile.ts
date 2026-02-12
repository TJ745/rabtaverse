"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth"; // or your auth helper
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

type UpdateProfileInput = {
  name: string;
  about?: string;
  image?: string;
  file?: File;
};

export async function updateProfile(data: UpdateProfileInput) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) throw new Error("User not found");

  let finalImageUrl = data.image;

  if (data.file) {
    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      session.user.id,
    );
    if (!fs.existsSync(uploadsDir))
      fs.mkdirSync(uploadsDir, { recursive: true });

    const filename = `${Date.now()}-${data.file.name}`;
    const buffer = Buffer.from(await data.file.arrayBuffer());
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);

    finalImageUrl = `/uploads/${session.user.id}/${filename}`;

    if (user.image && user.image.startsWith(`/uploads/${session.user.id}/`)) {
      const oldImagePath = path.join(process.cwd(), "public", user.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }
  }

  return prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      about: data.about,
      image: finalImageUrl,
    },
  });
}

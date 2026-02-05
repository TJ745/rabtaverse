"use server";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getMessages(conversationId: string) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  return messages.map((m) => ({
    id: m.id,
    conversationId: m.conversationId,
    fromMe: m.senderId === session.user.id,
    text: m.content ?? "",
    time: new Date(m.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));
}

export async function sendMessage(conversationId: string, content: string) {
  if (!conversationId || typeof conversationId !== "string") {
    throw new Error("Invalid conversationId");
  }

  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const message = await prisma.message.create({
    data: {
      content,
      senderId: session.user.id,
      conversationId,
    },
  });

  // if (globalThis.io) {
  //   globalThis.io.emit("receive_message", {
  //     id: message.id,
  //     conversationId: message.conversationId,
  //     text: message.content,
  //     senderId: message.senderId,
  //     time: new Date(message.createdAt).toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     }),
  //   });
  // }

  return message;
}

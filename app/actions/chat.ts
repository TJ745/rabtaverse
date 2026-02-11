"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getChatList() {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const conversations = await prisma.conversation.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return conversations.map((conv) => {
    const otherUser = conv.members.find((m) => m.userId !== userId)?.user;

    return {
      id: conv.id,
      name: otherUser?.name || "Group",
      avatar: otherUser?.image,
      lastMessage: conv.messages[0]?.content || "",
      members: conv.members.map((m) => ({ id: m.id, userId: m.userId })),
    };
  });
}

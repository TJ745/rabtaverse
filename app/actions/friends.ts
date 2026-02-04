"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function searchUsers(query: string) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.user.findMany({
    where: {
      name: { contains: query, mode: "insensitive" },
      NOT: { id: session.user.id },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
    take: 10,
  });
}

export async function sendFriendRequest(receiverId: string) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const senderId = session.user.id;

  if (receiverId === senderId)
    return { status: "error", message: "Cannot add yourself" };

  // Already friends?
  const existingFriend = await prisma.friend.findFirst({
    where: {
      OR: [
        { userId: senderId, friendId: receiverId },
        { userId: receiverId, friendId: senderId },
      ],
    },
  });

  if (existingFriend) {
    return { status: "exists", message: "Already friends" };
  }

  // Already requested?
  const existingRequest = await prisma.friendRequest.findFirst({
    where: {
      senderId,
      receiverId,
    },
  });

  if (existingRequest) {
    return { status: "pending", message: "Request already sent" };
  }

  await prisma.friendRequest.create({
    data: {
      senderId,
      receiverId,
    },
  });

  return { status: "sent", message: "Friend request sent" };
}

export async function getFriendRequests() {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.friendRequest.findMany({
    where: {
      receiverId: session.user.id,
      status: "PENDING",
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function acceptFriendRequest(requestId: string) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const req = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  });

  if (!req || req.receiverId !== session.user.id) {
    throw new Error("Invalid request");
  }

  await prisma.$transaction([
    prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
    }),

    prisma.friend.create({
      data: {
        userId: req.senderId,
        friendId: req.receiverId,
      },
    }),

    prisma.friend.create({
      data: {
        userId: req.receiverId,
        friendId: req.senderId,
      },
    }),

    prisma.conversation.create({
      data: {
        type: "PRIVATE",
        members: {
          create: [{ userId: req.senderId }, { userId: req.receiverId }],
        },
      },
    }),
  ]);
}

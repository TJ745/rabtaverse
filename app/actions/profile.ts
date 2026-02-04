import prisma from "@/lib/prisma";

type UpdateProfileInput = {
  name?: string;
  about?: string;
  image?: string;
};

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      about: data.about,
      image: data.image,
    },
  });
}

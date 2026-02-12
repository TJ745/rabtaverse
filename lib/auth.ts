import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],
});

// export async function getSession() {
//   const result = await auth.api.getSession({
//     headers: await headers(),
//   });

//   return result;
// }

export async function getSession() {
  const result = await auth.api.getSession({
    headers: await headers(),
  });

  if (!result?.session) return null;

  // Fetch full user profile from DB
  const user = await prisma.user.findUnique({
    where: { id: result.session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      about: true, // <-- include the about field
    },
  });

  if (!user) return null;

  // Merge user into session
  return {
    ...result,
    session: {
      ...result.session,
      user: {
        ...result.user,
        about: user.about || null,
      },
    },
  };
}

export async function signOut() {
  const result = await auth.api.signOut({
    headers: await headers(),
  });

  if (result.success) {
    redirect("/login");
  }
}

export async function getToken() {
  const session = await getSession();
  return session?.session.token; // or session?.token depending on your schema
}

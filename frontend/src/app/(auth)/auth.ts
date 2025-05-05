// auth.ts
import { compare } from "bcrypt-ts";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail, getUserByUsername } from "@/lib/db/queries";
import { authConfig } from "./auth.config";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, username, password }: any) {
        const user =
          email !== undefined
            ? await getUserByEmail(email)
            : await getUserByUsername(username);

        if (!user) return null;

        const passwordsMatch = await compare(password, user.password!);
        if (!passwordsMatch) return null;

        return {
          id: user.id,
          role: user.role,
          email: user.email,
        };
      },
    }),
  ],
});

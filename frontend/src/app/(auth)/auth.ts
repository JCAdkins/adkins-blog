import { compare } from "bcrypt-ts";
import NextAuth, { type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
import { getUserByEmail, getUserByUsername } from "@/lib/db/queries";
import { authConfig } from "./auth.config";

// Extend NextAuth's User and Session interfaces to include the role field
interface ExtendedUser extends User {
  role: string; // Add the 'role' field to the user
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {},
      async authorize({
        email = undefined,
        username = undefined,
        password,
      }: any) {
        const user = email
          ? await getUserByEmail(email)
          : await getUserByUsername(username);

        if (!user) return null;
        // biome-ignore lint: Forbidden non-null assertion.
        const passwordsMatch = await compare(password, user.password!);
        if (!passwordsMatch) return null;

        // Add role to the user object returned after successful login
        return {
          ...user,
          role: user.role, // Ensure the role is included
          username: user.username,
        } as ExtendedUser;
      },
    }),
  ],
});

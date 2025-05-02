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
  providers: [
    Credentials({
      credentials: {},
      async authorize({
        email = undefined,
        username = undefined,
        password,
      }: any) {
        const users = email
          ? await getUserByEmail(email)
          : await getUserByUsername(username);

        if (users.length === 0) return null;
        // biome-ignore lint: Forbidden non-null assertion.
        const passwordsMatch = await compare(password, users[0].password!);
        if (!passwordsMatch) return null;

        // Add role to the user object returned after successful login
        return {
          ...users[0],
          role: users[0].role, // Ensure the role is included
        } as ExtendedUser;
      },
    }),
  ],
});

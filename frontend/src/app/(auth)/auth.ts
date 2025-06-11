import { compare } from "bcrypt-ts";
import NextAuth, { type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
import { getUserByEmail, getUserByUsername } from "@/lib/db/queries";
import config from "./auth.config";

// Extend NextAuth's User and Session interfaces to include the role field
interface ExtendedUser extends User {
  role: string; // Add the 'role' field to the user
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...config,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "johndoe@gmail.com",
        },
        password: { label: "Password", type: "password", placeholder: "*****" },
        username: { label: "Username", type: "username" },
      },
      async authorize(credentials: any) {
        const user = credentials.email
          ? await getUserByEmail(credentials.email)
          : await getUserByUsername(credentials.username);

        if (!user) return null;
        // biome-ignore lint: Forbidden non-null assertion.
        const passwordsMatch = await compare(
          credentials.password,
          user.password!
        );
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

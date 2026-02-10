import { compare } from "bcrypt-ts";
import NextAuth, { type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
import {
  getUserByEmail,
  getUserByUsername,
  updateUserLoginAt,
} from "@/lib/db/queries";
import config from "./auth.config";

// Extend NextAuth's User and Session interfaces to include the role field
interface ExtendedUser extends User {
  role: string; // Add the 'role' field to the user
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...config,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
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
          : credentials.username
            ? await getUserByUsername(credentials.username)
            : null;

        if (!user) return null;

        const passwordsMatch = await compare(
          credentials.password,
          user.password,
        );
        if (!passwordsMatch) return null;

        // Add role to the user object returned after successful login
        await updateUserLoginAt(user.id); // Log the user in (update last login time)
        return {
          id: user.id,
          role: user.role, // Ensure the role is included
          username: user.username,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          image: user.image,
        } as ExtendedUser;
      },
    }),
  ],
});

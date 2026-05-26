import { UUID } from "crypto";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: UUID;
    role: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    image?: string;
    location?: string;
    isVerified: boolean;

    profileVisibility: "public" | "users" | "private";
    activityVisible: boolean;
    sessions: UserSession[];
  }
  interface Session {
    token?: any;
    user: {
      id: string;
      role: string;
      username: string;
      isVerified: boolean;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    role: string;
    username: string;
    isVerified: boolean;
  }
}

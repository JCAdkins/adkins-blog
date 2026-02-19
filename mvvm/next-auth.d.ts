import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    image?: string;
    location?: string;

    profileVisibility?: "public" | "friends" | "private";
    activityVisible?: boolean;
    sessions: UserSession[];
  }
  interface Session {
    token?: any;
    user: {
      id: string;
      role: string;
      username: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    role: string;
    username: string;
  }
}

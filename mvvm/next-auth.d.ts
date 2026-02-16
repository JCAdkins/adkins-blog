import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    username: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    email?: string;
    image?: string;
    password: string;
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

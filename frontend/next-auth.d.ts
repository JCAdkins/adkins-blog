import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    username: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
  interface Session {
    user: User;
  }

  interface JWT {
    id: string;
    role: string;
    username: string;
  }

  interface Blog {
    id: Key | null | undefined;
    title: string;
    description: string;
    content: string;
    featured: boolean;
    blogPostImages?: BlogPostImage[];
    createdAt: string;
    updatedAt: string;
  }

  interface NewBlog {
    title: string;
    description: string;
    content: string;
    featured: string;
    images?: string[];
  }

  interface Image {
    id: number;
    status: string;
  }

  interface BlogPostImage {
    blogPostId: string;
    id: string;
    image: Image;
  }
}

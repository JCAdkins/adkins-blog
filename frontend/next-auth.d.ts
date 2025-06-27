import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    username: string;
    name?: string;
    email?: string;
    image?: string;
  }
  interface Session {
    user: User;
  }

  interface JWT {
    id: string;
    role: string;
    username: string;
  }

  export type Blog = {
    genre: BlogGenre;
    id: Key | null | undefined;
    title: string;
    description: string;
    content: string;
    featured: boolean;
    blogPostImages?: BlogPostImage[];
    createdAt: string;
    updatedAt: string;
  };

  const genreOptions = [
    "educational",
    "excursion",
    "review",
    "comparison",
    "tutorial",
    "news",
  ] as const;

  export type BlogGenre = (typeof genreOptions)[number];

  export type NewBlog = {
    title: string;
    description: string;
    content: string;
    featured: string;
    images?: string[];
  };

  export type Image = {
    id: number;
    status: string;
  };

  interface BlogPostImage {
    blogPostId: string;
    id: string;
    imageId: string;
  }

  interface Comment {
    id: string;
    content: string;
    author: User;
    authorId: string;
    postId: string;
    createdAt: string;
    updatedAt: string;
    parentId?: number;
    replies?: Comment[];
    repliesCount: number;
    likes: Like[];
    isDeleted: boolean;
  }

  type Like = {
    id: string;
    commentId: string;
    userId: string;
    createdAt: string;
  };
}

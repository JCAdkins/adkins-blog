import { Prisma } from "@prisma/client";

export interface ImmichImage {
  id: string; // e.g. '04f57ec0-da1d-4ade-b82c-00b040680f87'
  status: string; // e.g. 'created'
}

export interface BlogPostInput {
  title: string;
  description: string;
  genre: BlogGenre;
  content: string;
  featured: string;
  images?: ImmichImage[]; // Relation
}

export interface NewUserInput {
  email: string;
  password: string;
  username: string;
  first_name?: string;
  last_name?: string;
  role: "user" | "admin"; // optional if you default to "user"
}

// Define the shape of a comment with author, post, replies, and parentId
export type CommentWithRelations = Prisma.CommentGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        email: true;
        username: true;
        role: true;
      };
    };
    post: true;
    replies: true;
  };
}>;

export const genreOptions = [
  "educational",
  "excursion",
  "review",
  "comparison",
  "tutorial",
  "news",
] as const;

export type BlogGenre = (typeof genreOptions)[number];

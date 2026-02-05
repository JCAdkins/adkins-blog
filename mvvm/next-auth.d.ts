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

  export type Term = {
    word: string;
    definition: string;
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

  export interface BlogPostImage {
    blogPostId: string;
    id: string;
    imageId: string;
  }

  export interface BlogComment {
    id: string;
    content: string;
    author: User;
    authorId: string;
    postId: string;
    createdAt: string;
    updatedAt: string;
    parentId?: string;
    replies: BlogComment[];
    repliesCount: number;
    likes: Like[];
    isDeleted: boolean;
    hasMore: boolean;
    childrenIds: string[];
    likesCount: number;
    userHasLiked: boolean;
  }

  export type Like = {
    id: string;
    commentId: string;
    userId: string;
    createdAt: string;
  };
}

export type Notification = {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  userId: string;
  actor: {
    id: string;
    username: string;
    image?: string;
  };
  comment?: BlogComment;
  type: "LIKE" | "REPLY";
};

export type Message = {
  id: string;
  subject: string;
  message: string;
  name: string;
  email: string;
  createdAt: string;
  read: boolean;
};

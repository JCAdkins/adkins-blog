import { Prisma } from "../generated/prisma/index.js";

export type CommentInput = {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string | null;
};

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

import { User } from "next-auth";
import { Like } from "../likeModel";

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

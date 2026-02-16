import { BlogComment } from "./blog/blogCommentModel";

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

// lib/db/queries.ts

import axios from "axios";
import { Blog, BlogComment, NewBlog, User } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

/*++===========================================================================================================++
  ||                                           USER DATABASE QUERIES                                           ||
  ++===========================================================================================================++*/

export async function createUser(userData: {
  email: string;
  username: string;
  password: string;
  role: string;
  name?: string;
}): Promise<User> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Fetch failed:", errText);
      throw new Error("Failed to create user");
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}

export async function getUserByEmail(
  email: string,
  include?: boolean
): Promise<User | null> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BASE_URL}/users/email/${encodeURIComponent(email)}`
  );

  if (include) {
    url.searchParams.set("include", JSON.stringify(include));
  }
  const res = await fetch(url.toString(), {
    headers: {},
  });
  if (!res.ok) return null;
  return await res.json();
}

export async function getUserByUsername(
  username: string,
  include?: boolean
): Promise<User | null> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BASE_URL}/users/username/${encodeURIComponent(username)}`
  );

  if (include) {
    url.searchParams.set("include", JSON.stringify(include));
  }
  const res = await fetch(url.toString());
  if (!res.ok) return null;
  return await res.json();
}

/*++===========================================================================================================++
  ||                                           BLOG DATABASE QUERIES                                           ||
  ++===========================================================================================================++*/

// Doesn't need secured
export async function getFeaturedBlogs(): Promise<Blog[] | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/blog/featured`
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    return null;
  }
}

// Doesn't need secured
export async function getAllBlogs(): Promise<Blog[] | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blog`);
    if (!response.ok) return null;

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return null;
  }
}

// Needs secured
export async function createNewBlog({
  blogData,
  token,
}: {
  blogData: NewBlog;
  token: any;
}) {
  try {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (token.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Sign the decoded token to create a raw JWT string
    const signedToken = jwt.sign(token, process.env.NEXTAUTH_SECRET!);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${signedToken}`,
      },
      body: JSON.stringify(blogData),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Fetch failed:", errText);
      throw new Error("Failed to create blog");
    }
    redirect("/admin");
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}

// Doesn't need secured
export async function getBlogById(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${id}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) {
      const errText = await response.text();
      console.error("Fetch failed:", errText);
      throw new Error("Failed to fetch blog.");
    }
    return await response.json();
  } catch (err) {
    console.error("Error fetching featured blogs:", err);
    return null;
  }
}

/*++===========================================================================================================++
  ||                                       MESSAGES DATABASE QUERIES                                           ||
  ++===========================================================================================================++*/

export const markMessageAsRead = async (id: string) => {
  try {
    const res = await fetch("/api/admin/messages/mark-read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to mark message as read: ", error);
  }
};

/*++===========================================================================================================++
  ||                                       COMMENTS DATABASE QUERIES                                           ||
  ++===========================================================================================================++*/

export async function fetchBlogCommentsPaginated({
  blogId,
  page = 1,
  pageSize = 10,
}: {
  blogId: number | string;
  page?: number;
  pageSize?: number;
}): Promise<{
  comments: BlogComment[];
  allCommentCount: number;
  topLevelCount: number;
}> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/comments?blogId=${blogId}&page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to fetch comments:", errorText);
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    const data = await res.json();

    if (data.error) {
      console.error("Failed to fetch comments:", data.error);
      throw new Error(`Error: ${data.error}`);
    }
    return data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return {
      comments: [],
      allCommentCount: 0,
      topLevelCount: 0,
    };
  }
}

export async function fetchCommentByIdWithAncestors({ id }: { id: string }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/comments/${id}?recurse=true`
    );
    if (!res.ok) throw new Error("Failed to fetch replies");

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("There was an error fething the comment tree: ", error);
    return { error: "There was an error fetching the comment tree." };
  }
}

export async function postNewComment({
  content,
  blogId,
  authorId,
  parentId,
}: {
  content: string;
  blogId: string;
  authorId: string;
  parentId?: string;
}) {
  try {
    const res = await axios.post("/api/comment/create-comment", {
      content,
      blogId,
      authorId,
      parentId,
    });
    return res.data;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
}

export async function deleteComment(commentId: string, type: string) {
  try {
    const res = await fetch(
      `/api/comment/delete-comment/${commentId}?hard=${type}`,
      {
        method: "DELETE",
      }
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to delete comment", err);
    return { error: "Failed to delete comment." };
  }
}

export async function fetchRepliesForComment(
  commentId: string,
  page = 1,
  limit = 3
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/comments/${commentId}/replies?page=${page}&limit=${limit}`
    );

    if (!res.ok) throw new Error("Failed to fetch replies");

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching more replies:", error);
    return { error: "There was an error fetching more replies." };
  }
}

export async function likeComment(
  commentId: string,
  authorId: string,
  userId: string
) {
  try {
    const res = await axios.post("/api/comment/like-comment", {
      commentId,
      authorId,
      userId,
    });

    return res.data;
  } catch (error) {
    console.error("Error posting comment:", error);
    return { error: "There was an error posting the comment" };
  }
}

/*++===========================================================================================================++
  ||                                   NOTIFICATION DATABASE QUERIES                                           ||
  ++===========================================================================================================++*/

export async function fetchNotifications(userId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications?userId=${userId}`
    );
    return await res.json();
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function markNotificationAsRead(notifId: string) {
  try {
    const res = await fetch("api/notifications/mark-read", {
      method: "POST",
      body: JSON.stringify(notifId),
    });
    return await res.json();
  } catch (error) {
    console.error("Error: ", error);
    return { error: "There was an issue marking the notification as read" };
  }
}

export async function getUserNotifications(userId: string, page: number = 1) {
  try {
    const limit = 10;
    const offset = page * limit;

    const response = await fetch(
      `/api/notifications/${encodeURIComponent(userId)}?offset=${offset}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch notifications");
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function markAllAsRead(id: string) {}
/**
 * Creates a like notification for a user's comment.
 *
 * @param params.commentId - The ID of the comment that was liked.
 * @param params.authorName - The name of the user who liked the comment.
 * @param params.userId - The ID of the user who owns the comment (i.e., the recipient of the notification).
 * @param params.actorId - The ID of the user who performed the like action (used for validation or analytics).
 *
 * @returns A response object containing the created or deleted notification, or an error.
 */
export async function createLikeNotification({
  commentId,
  authorName,
  userId,
  actorId,
}: {
  commentId: string;
  authorName: string;
  userId: string;
  actorId: string;
}) {
  try {
    const res = await axios.post("/api/notifications/like", {
      commentId,
      authorName,
      userId,
      actorId,
    });
    return res.data;
  } catch (error) {
    console.error("Error: ", error);
    return { error: error };
  }
}

/**
 * Creates a reply notification to a user's comment.
 *
 * @param params.commentId - The ID of the comment that was replied to.
 * @param params.authorName - The name of the user who replied to the comment.
 * @param params.userId - The ID of the user who owns the comment (i.e., the recipient of the notification).
 * @param params.actorId - The ID of the user who performed the reply action (used for validation or analytics).
 *
 * @returns A response object containing the created or deleted notification, or an error.
 */
export async function createReplyNotification({
  commentId,
  replyId,
  authorName,
  userId,
  actorId,
}: {
  commentId: string;
  replyId: string;
  authorName: string;
  userId: string;
  actorId: string;
}) {
  try {
    const res = await axios.post("/api/notifications/reply", {
      commentId,
      replyId,
      authorName,
      userId,
      actorId,
    });
    return res.data;
  } catch (error) {
    console.error("Error: ", error);
    return { error: error };
  }
}

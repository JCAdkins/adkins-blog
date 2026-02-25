// lib/db/queries.ts

import axios from "axios";
import { User } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getAuthToken } from "../utils";
import { UserDb } from "@/models/userDb";
import { Blog } from "@/models/blog/blogModel";
import { NewBlog } from "@/models/blog/newBlogModel";
import { BlogComment } from "@/models/blog/blogCommentModel";
import {
  PasswordFormValues,
  PrivacyFormValues,
  ProfileFormValues,
} from "@/schemas/settings";
import { UserSession } from "@/models/userSession";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

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
      },
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
  include?: boolean,
): Promise<UserDb | null> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BASE_URL}/users/email/${encodeURIComponent(email)}`,
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
  include?: boolean,
): Promise<UserDb | null> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BASE_URL}/users/username/${encodeURIComponent(username)}`,
  );

  if (include) {
    url.searchParams.set("include", JSON.stringify(include));
  }
  const res = await fetch(url.toString());
  if (!res.ok) return null;
  return await res.json();
}

export async function updateUserLoginAt(userId: string, userAgent: string) {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/login`, {
      userId,
      userAgent,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
  }
}

export async function getUserProfile(userId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}/profile`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to fetch profile");
  }

  return await res.json();
}

export async function getUserStats(): Promise<
  | {
      totalUsers: number;
      activeUsers: number;
      newUsersThisWeek: number;
      newUsersThisMonth: number;
      usersPerDay: any[];
      usersPerMonth: any[];
      topActiveUsers: User[];
    }
  | { error: string }
> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/users/stats`;
    const token = await getAuthToken();
    if (!token) {
      console.error("No auth token found");
      return { error: "Unauthorized" };
    }
    const signedToken = jwt.sign(token, process.env.NEXTAUTH_SECRET!);
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${signedToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return { error: `There was an error fetching user stats. \n${error}` };
  }
}

export async function getMe(): Promise<User | { error: string }> {
  try {
    const tokenRes = await axios.get("/api/auth/token");
    const { token } = tokenRes.data;

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/me`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data: User = res.data;
    return {
      id: data.id,
      role: data.role,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      image: data.image,
      location: data.location,
      profileVisibility: data.profileVisibility,
      activityVisible: data.activityVisible,
      sessions: data.sessions.map((session) => {
        return {
          ...session,
          createdAt: new Date(session.createdAt),
          lastActiveAt: new Date(session.lastActiveAt),
        };
      }) as UserSession[],
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return { error: `There was an error fetching user stats. \n${error}` };
  }
}

export async function updateUserProfile(
  data: ProfileFormValues,
): Promise<void> {
  const tokenRes = await axios.get("/api/auth/token");
  const { token } = tokenRes.data;

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/me`;
  const res = await axios.patch(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function updateUserPassword(
  data: PasswordFormValues,
): Promise<void> {
  try {
    const tokenRes = await axios.get("/api/auth/token");
    const { token } = tokenRes.data;

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/me/password`;
    const res = await axios.patch(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error);
  }
}

export async function updateUserPrivacy(
  data: PrivacyFormValues,
): Promise<void> {
  const tokenRes = await axios.get("/api/auth/token");
  const { token } = tokenRes.data;

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/me/privacy`;
  const res = await axios.patch(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function uploadAvatar(file: File): Promise<{ image: string }> {
  const tokenRes = await axios.get("/api/auth/token");
  const { token } = tokenRes.data;

  const formData = new FormData();
  formData.append("avatar", file);

  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/users/me/avatar`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
}

export async function deleteSession(id: string) {
  const tokenRes = await axios.get("/api/auth/token");
  const { token } = tokenRes.data;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/me/session/${id}`;
  const res = await axios.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function deleteAllOtherSessions(sessionId: string) {
  const tokenRes = await axios.get("/api/auth/token");
  const { token } = tokenRes.data;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/me/sessions/${sessionId}`;
  const res = await axios.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

/*++===========================================================================================================++
  ||                                           BLOG DATABASE QUERIES                                           ||
  ++===========================================================================================================++*/

// Doesn't need secured
export async function getFeaturedBlogs(): Promise<Blog[] | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/blog/featured`,
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
      },
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

export const getMessages = async () => {
  try {
    const tokenRes = await axios.get("/api/auth/token");
    const { token } = tokenRes.data;
    const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/messages`;
    const res = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("There was an error fething messages: ", error);
    return { error: "There was an error fetching messages." };
  }
};

export const markMessageAsRead = async (id: string) => {
  try {
    const tokenRes = await axios.get("/api/auth/token");
    const { token } = tokenRes.data;
    const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/messages/mark-read`;
    const res = await axios.post(URL, id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
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
      },
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

export async function fetchCommentByIdWithAncestors({
  commentId,
  postId,
}: {
  commentId: string;
  postId?: string;
}) {
  const url = postId
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/comments/${commentId}?postId=${postId}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}/comments/${commentId}`;
  try {
    const res = await fetch(url);
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
    const tokenRes = await axios.get("/api/auth/token");
    const { token } = tokenRes.data;
    const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/comments`;
    const res = await axios.post(
      URL,
      {
        content,
        blogId,
        authorId,
        parentId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
}

export async function deleteCommentLib(commentId: string, type: string) {
  try {
    const tokenRes = await axios.get("/api/auth/token");
    const { token } = tokenRes.data;
    const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/comments/${commentId}?hard=${type}`;
    const res = await axios.delete(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to delete comment", err);
    return { error: "Failed to delete comment." };
  }
}

export async function fetchRepliesForComment(
  commentId: string,
  page = 1,
  limit = 3,
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/comments/${commentId}/replies?page=${page}&limit=${limit}`,
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
  userId: string,
) {
  try {
    const tokenRes = await axios.get("/api/auth/token");
    const { token } = tokenRes.data;
    const cToken = token;
    let sToken;
    if (!cToken) {
      sToken = await getAuthToken();
    }
    if (!sToken && !cToken) {
      throw new Error("Unauthorized");
    }
    const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/comments/like`;
    const res = await axios.post(
      URL,
      {
        commentId,
        authorId,
        userId,
      },
      {
        headers: {
          Authorization: `Bearer ${sToken ? sToken : cToken}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    console.error("Error posting comment:", error);
    return { error: "There was an error posting the comment" };
  }
}

export async function getCommentStats(): Promise<
  | {
      totalComments: number;
      totalReplies: number;
      totalTopLevelComments: number;
      avgCommentsPerBlog: number;
      topCommentedBlogs: any[];
      commentsPerDay: any[];
      commentsPerMonth: any[];
    }
  | { error: string }
> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/comments/stats`;
    const token = await getAuthToken();
    if (!token) {
      console.error("No auth token found");
      return { error: "Unauthorized" };
    }
    const signedToken = jwt.sign(token, process.env.NEXTAUTH_SECRET!);
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${signedToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching comment stats:", error);
    return { error: "There was an error fetching comment stats" };
  }
}

/*++===========================================================================================================++
  ||                                   NOTIFICATION DATABASE QUERIES                                           ||
  ++===========================================================================================================++*/

export async function fetchNotifications(userId: string) {
  try {
    const tokenRes = await axios.get("/api/auth/token");
    const { token } = tokenRes.data;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/unread/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return await res.data;
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function markNotificationAsRead(notifId: string) {
  try {
    const tokenRes = await axios.get("/api/auth/token");
    const { token } = tokenRes.data;
    const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/mark-read`;
    const res = await axios.post(URL, notifId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error: ", error);
    return { error: "There was an issue marking the notification as read" };
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    const tokenRes = await axios.get("/api/auth/token");
    const { token } = tokenRes.data;
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/mark-all-read`;
    const res = await axios.post(url, userId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.data;
  } catch (error) {
    console.error("Error: ", error);
    return { error: "There was an issue marking all notifications as read" };
  }
}

export async function getUserNotifications(userId: string, page: number = 1) {
  try {
    const tokenRes = await axios.get("/api/auth/token");
    const { token } = tokenRes.data;
    const limit = 10;
    const offset = page * limit;
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/${encodeURIComponent(userId)}?offset=${offset}&limit=${limit}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

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
    const tokenRes = await axios.get("/api/auth/token");
    const { token } = tokenRes.data;
    const cToken = token;
    let sToken;
    if (!cToken) {
      sToken = await getAuthToken();
    }
    if (!sToken && !cToken) {
      throw new Error("Unauthorized");
    }
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/like`;
    const res = await axios.post(
      url,
      {
        commentId,
        authorName,
        userId,
        actorId,
      },
      {
        headers: {
          Authorization: `Bearer ${cToken ? cToken : sToken}`,
        },
      },
    );
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
    const tokenRes = await axios.get("/api/auth/token");
    const { token } = tokenRes.data;
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/reply`;
    const res = await axios.post(
      url,
      {
        commentId,
        replyId,
        authorName,
        userId,
        actorId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error: ", error);
    return { error: error };
  }
}

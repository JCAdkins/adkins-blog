// lib/db/queries.ts

import axios from "axios";
import { Blog, NewBlog, User } from "next-auth";
import { redirect } from "next/navigation";

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
    const res = await fetch(`${process.env.BASE_URL || ""}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

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

export async function getUserByEmail(email: string): Promise<User | null> {
  const res = await fetch(
    `${process.env.BASE_URL || ""}/users/email/${encodeURIComponent(email)}`
  );
  if (!res.ok) return null;
  return await res.json();
}

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  const res = await fetch(
    `${process.env.BASE_URL || ""}/users/username/${encodeURIComponent(username)}`
  );
  if (!res.ok) return null;
  return await res.json();
}

/*++===========================================================================================================++
  ||                                           BLOG DATABASE QUERIES                                           ||
  ++===========================================================================================================++*/

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

export async function getAllBlogs(): Promise<Blog[] | null> {
  try {
    const response = await fetch(`${process.env.BASE_URL}/blog`);
    if (!response.ok) return null;

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return null;
  }
}

export async function createNewBlog(blogData: NewBlog): Promise<Blog | null> {
  try {
    const response = await fetch(`${process.env.BASE_URL}/blog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogData),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Fetch failed:", errText);
      throw new Error("Failed to create blog");
    }

    redirect("/admin");
    return await response.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}

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

export async function fetchUnread() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/messages/unread/count`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching unread count:", err);
  }
}

export const fetchMessages = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/messages`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch messages:", err);
  }
};

export const markMessageAsRead = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/messages/mark-read`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      }
    );
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
}): Promise<{ comments: Comment[]; totalCount: number }> {
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
    return { comments: [], totalCount: 0 };
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
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/comments`,
      {
        content,
        blogId,
        authorId,
        parentId,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
}

export async function softDeleteComment(commentId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/comments/${commentId}?hard=false`,
      {
        method: "DELETE",
      }
    );
  } catch (err) {
    console.error("Failed to delete comment", err);
  }
}

export async function hardDeleteComment(commentId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/comments/${commentId}?hard=true`,
      {
        method: "DELETE",
      }
    );
  } catch (err) {
    console.error("Failed to delete comment", err);
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
    return data.repliesWithCounts;
  } catch (error) {
    console.error("Error fetching more replies:", error);
    throw error;
  }
}

export async function likeComment(commentId: string, userId: string) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/comments/like`,
      {
        commentId,
        userId,
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
}

// lib/db/queries.ts

import { Blog, NewBlog, User } from "next-auth";
import { redirectToAdmin } from "../utils";
import axios from "axios";

export async function createUser(userData: {
  email: string;
  username: string;
  password: string;
  role: string;
  name?: string;
}): Promise<User> {
  console.log(
    `${process.env.BASE_URL || ""}/users/register`,
    JSON.stringify(userData),
  );
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
  // if (!res.ok) {
  //   throw new Error("Failed to create user");
  // }

  // return await res.json();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const res = await fetch(
    `${process.env.BASE_URL || ""}/users/email/${encodeURIComponent(email)}`,
  );
  if (!res.ok) return null;
  return await res.json();
}

export async function getUserByUsername(
  username: string,
): Promise<User | null> {
  const res = await fetch(
    `${process.env.BASE_URL || ""}/users/username/${encodeURIComponent(username)}`,
  );
  if (!res.ok) return null;
  return await res.json();
}

export async function getFeaturedBlogs(): Promise<Blog[] | null> {
  try {
    const response = await fetch(`${process.env.BASE_URL}/blog/featured`);
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

    // Flatten the blogPostImages and include only the relevant data (images)
    // const blogs = data.map((blog: any) => {
    //   return {
    //     ...blog,
    //     images: blog.blogPostImages.map((postImage: any) => postImage.image), // Extract only the image data
    //   };
    // });
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return null;
  }
}

export async function getImmichImage(id: number | undefined) {
  if (!id) return;
  console.log(`${process.env.BASE_URL}/images`);
  try {
    console.log("attempting image download...");
    const response = await axios.get(`${process.env.BASE_URL}/images`, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/octet-stream",
      },
      params: {
        id, // sends as ?id=yourId
      },
    });

    const contentType = response.headers["content-type"] || "image/png";
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const dataUrl = `data:${contentType};base64,${base64Image}`;
    console.log("imageUrl: ", dataUrl);
    return dataUrl;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}

export async function createNewBlog(blogData: NewBlog): Promise<Blog | null> {
  try {
    console.log("trying to create new blog");
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

    redirectToAdmin();
    return await response.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}

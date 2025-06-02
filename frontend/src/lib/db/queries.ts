// lib/db/queries.ts

import { Blog, NewBlog, User } from "next-auth";
import axios from "axios";
import { redirect } from "next/navigation";

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

type AssetType = "original" | "thumbnail";

interface GetImmichAssetParams {
  type: AssetType;
  id: number | string | undefined;
}

export async function getImmichAsset({ type, id }: GetImmichAssetParams) {
  console.log("trying to fetch immich asset...");
  console.log("id: ", id);
  if (!id) return;
  const route = type === "original" ? "images" : "thumbnail";
  console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/${route}`);
  try {
    console.log("attempting image download...");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${route}`,
      {
        responseType: "arraybuffer",
        headers: {
          Accept: "application/octet-stream",
        },
        params: {
          id, // sends as ?id=yourId
        },
      },
    );

    const contentType = response.headers["content-type"] || "image/png";
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const dataUrl = `data:${contentType};base64,${base64Image}`;
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

    redirect("/admin");
    return await response.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}

export async function getBlogById(id: string) {
  console.log("fetching blog by id...");
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

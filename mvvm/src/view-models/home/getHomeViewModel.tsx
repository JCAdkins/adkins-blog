// viewmodels/home/getHomeViewModel.ts
import { getFeaturedBlogs } from "@/lib/db/queries";
import { fnv1aHash } from "@/lib/utils";
import fs from "fs/promises";
import path from "path";

export async function getHomeViewModel() {
  const filePath = path.join(process.cwd(), "src/terms/photography_terms.json");

  const file = await fs.readFile(filePath, "utf8");
  const terms = JSON.parse(file);

  const today = new Date().toISOString().split("T")[0];
  const index = fnv1aHash(today) % terms.length;

  return {
    featuredPosts: await getFeaturedBlogs(),
    term: terms[index],
  };
}

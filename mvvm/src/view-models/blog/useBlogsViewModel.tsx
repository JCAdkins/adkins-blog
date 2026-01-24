import { getAllBlogs } from "@/lib/db/queries";

export const useBlogsViewModel = async () => {
  const posts = await getAllBlogs();
  const POST_LIMIT = 3; // 3 Because that's how many posts i want to show for each section/genre

  const newestPosts = posts?.slice(0, POST_LIMIT);
  const genres = Array.from(
    new Set(posts?.map((p) => p.genre).filter(Boolean)),
  );
  const postsByGenre = genres.map((genre) => ({
    genre,
    posts: posts?.filter((p) => p.genre === genre).slice(0, POST_LIMIT),
  }));

  return { posts, newestPosts, postsByGenre };
};

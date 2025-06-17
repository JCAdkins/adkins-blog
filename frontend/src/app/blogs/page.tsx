// app/posts/page.tsx
import BlogCard from "@/components/cards/blog-card";
import BlogCardServer from "@/components/cards/blog-card-server";
import { getAllBlogs } from "@/lib/db/queries";
import Link from "next/link";

export default async function BlogsPage() {
  const posts = await getAllBlogs(); // Fetch from DB

  // Sort & group
  const newestPosts = posts?.slice(0, 6); // or 5
  const genres = Array.from(
    new Set(posts?.map((p) => p.genre).filter(Boolean))
  );
  const postsByGenre = genres.map((genre) => ({
    genre,
    posts: posts?.filter((p) => p.genre === genre),
  }));

  return (
    <div className="space-y-12 p-6">
      {/* Newest Posts */}
      <section>
        <h2 className="text-2xl font-bold">🆕 New Posts</h2>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {newestPosts?.map((blog, ind) => (
            <li key={blog.id} className="p-4 rounded">
              <BlogCardServer key={ind} blog={blog} CardComponent={BlogCard} />
            </li>
          ))}
        </ul>
      </section>

      {/* Genre Sections */}
      {postsByGenre.map(({ genre, posts }) => (
        <section key={genre}>
          <h2 className="text-2xl font-bold">{genre}</h2>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {posts?.map((blog, ind) => (
              <li key={blog.id} className="p-4 rounded">
                <BlogCardServer
                  key={ind}
                  blog={blog}
                  CardComponent={BlogCard}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* All Posts */}
      <section>
        <h2 className="text-2xl font-bold">📚 All Blog Posts</h2>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {posts?.map((blog, ind) => (
            <li key={blog.id} className="p-4 rounded">
              <BlogCardServer key={ind} blog={blog} CardComponent={BlogCard} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

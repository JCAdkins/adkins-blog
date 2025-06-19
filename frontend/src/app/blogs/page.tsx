import { cn } from "@/lib/utils";
import BlogCard from "@/components/cards/blog-card";
import BlogCardServer from "@/components/cards/blog-card-server";
import { getAllBlogs } from "@/lib/db/queries";
import { capitalizeFirstLetter } from "@/lib/utils";
import MovingTextBackground from "@/components/backgrounds/moving-text-background";
import Link from "next/link";

export default async function BlogsPage() {
  const posts = await getAllBlogs();
  const POST_LIMIT = 3; // 3 Because that's how many posts i want to show for each section/genre

  const newestPosts = posts?.slice(0, POST_LIMIT);
  const genres = Array.from(
    new Set(posts?.map((p) => p.genre).filter(Boolean))
  );
  const postsByGenre = genres.map((genre) => ({
    genre,
    posts: posts?.filter((p) => p.genre === genre).slice(0, POST_LIMIT),
  }));

  return (
    <div className="space-y-8 bg-red-200/50">
      <MovingTextBackground />
      {/* Newest Posts */}
      <section className="min-h-2/3 bg-gradient-to-b from-white to-sky-300 py-24 px-6">
        <h2 className="text-4xl font-extrabold text-center mb-12">
          🆕 New Posts
        </h2>
        <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {newestPosts?.map((blog) => (
            <li key={blog.id}>
              <BlogCardServer
                blog={blog}
                CardComponent={BlogCard}
                extraProps={{
                  className: "bg-transparent border-none shadow-none",
                }}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Posts by Genre */}
      {postsByGenre.map(({ genre, posts }, i) => {
        const bg =
          i % 3 === 0
            ? "from-white/50 to-gray-500/50"
            : i % 3 === 1
              ? "from-white/50 to-gray-500/50"
              : "from-white/50 to-gray-200/50";
        return (
          <section
            key={genre}
            className={cn("min-h-2/3 py-24 px-6 bg-gradient-to-b gap-8", bg)}
          >
            <h2 className="text-4xl font-extrabold text-center mb-12">
              <Link href={`/blogs/${genre}`}>
                {capitalizeFirstLetter(genre)}
              </Link>
            </h2>
            <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {posts?.map((blog) => (
                <li key={blog.id}>
                  <BlogCardServer
                    blog={blog}
                    CardComponent={BlogCard}
                    extraProps={{
                      className: "bg-transparent border-none shadow-none",
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {/* All Posts */}
      <section className="min-h-2/3 bg-gradient-to-b from-white to-orange-200 py-24 px-6">
        <h2 className="text-4xl font-extrabold text-center mb-12">
          <Link href="blogs/all">📚 All Blog Posts</Link>
        </h2>
        <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {posts?.slice(0, POST_LIMIT).map((blog) => (
            <li key={blog.id}>
              <BlogCardServer
                blog={blog}
                CardComponent={BlogCard}
                extraProps={{
                  className: "bg-transparent border-none shadow-none",
                }}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

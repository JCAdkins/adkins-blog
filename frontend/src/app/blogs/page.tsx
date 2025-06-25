import { cn } from "@/lib/utils";
import BlogCard from "@/components/cards/blog-card";
import BlogCardServer from "@/components/cards/blog-card-server";
import { getAllBlogs } from "@/lib/db/queries";
import { capitalizeFirstLetter } from "@/lib/utils";
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
    <div className="space-y-0 ">
      {/* Fixed full background (only on sm and up) */}
      <div className="hidden sm:block fixed inset-0 -z-10 bg-[url('/hummingbird.webp')] min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" />
      {/* Newest Posts */}
      <section className="min-h-1/2 py-10 px-6">
        <h2 className="text-4xl font-extrabold text-shadow-glow text-center text-nowrap flex items-center flex-row space-x-2 mb-12">
          <div className="w-full border-1 border-black h-1 bg-header" />
          <p>🆕 New Posts</p>
          <div className="w-full border-1 border-black h-1 bg-header" />
        </h2>
        <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {newestPosts?.map((blog) => (
            <li key={blog.id}>
              <BlogCardServer
                blog={blog}
                CardComponent={BlogCard}
                extraProps={{
                  className:
                    "bg-transparent border-none shadow-none hover:shadow-none",
                  childProps: {
                    className:
                      "bg-header border-white border-1 rounded-md hover:shadow-md",
                  },
                }}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Posts by Genre */}
      {postsByGenre.map(({ genre, posts }, i) => {
        return (
          <section
            key={genre}
            className="min-h-1/2 py-10 px-6 bg-gradient-to-b gap-8"
          >
            <h2 className="text-4xl font-extrabold text-shadow-glow text-center text-nowrap flex flex-row items-center space-x-2 mb-12">
              <div className="w-full border-1 border-black h-1 bg-header" />
              <Link href={`/blogs/${genre}`}>
                {capitalizeFirstLetter(genre)}
              </Link>
              <div className="w-full border-1 border-black h-1 bg-header" />
            </h2>
            <ul className="grid gap-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {posts?.map((blog) => (
                <li key={blog.id}>
                  <BlogCardServer
                    blog={blog}
                    CardComponent={BlogCard}
                    extraProps={{
                      className:
                        "bg-transparent border-none shadow-none hover:shadow-none",
                      childProps: {
                        className:
                          "bg-header border-white border-2 rounded-md hover:shadow-md",
                      },
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {/* All Posts */}
      <section className="min-h-1/2 py-10 px-6">
        <h2 className="text-4xl font-extrabold text-shadow-glow text-center text-nowrap space-x-2 mb-12 flex flex-row items-center">
          <div className="w-full border-1 border-black h-1 bg-header" />
          <Link href="blogs/all">📚 All Blog Posts</Link>
          <div className="w-full border-1 border-black h-1 bg-header" />
        </h2>
        <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {posts?.slice(0, POST_LIMIT).map((blog) => (
            <li key={blog.id}>
              <BlogCardServer
                blog={blog}
                CardComponent={BlogCard}
                extraProps={{
                  className:
                    "bg-transparent border-none shadow-none hover:shadow-none",
                  childProps: {
                    className:
                      "bg-header border-white border-2 rounded-md hover:shadow-md",
                  },
                }}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

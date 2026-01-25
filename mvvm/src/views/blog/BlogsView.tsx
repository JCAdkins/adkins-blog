import { ScrollSwitchBg } from "@/components/backgrounds/scroll-switch-bg";
import BlogCard from "@/components/cards/blog-card";
import BlogCardServer from "@/components/cards/blog-card-server";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Blog } from "next-auth";
import Link from "next/link";

interface BlogsViewProps {
  posts: Blog[] | null;
  newestPosts: Blog[] | undefined;
  postsByGenre: {
    genre:
      | "educational"
      | "excursion"
      | "review"
      | "comparison"
      | "tutorial"
      | "news";
    posts: Blog[] | undefined;
  }[];
}

export const BlogsView = ({
  posts,
  newestPosts,
  postsByGenre,
}: BlogsViewProps) => {
  const POST_LIMIT = 3; // 3 Because that's how many posts i want to show for each section/genre

  return (
    <div className="space-y-0">
      {/* Fixed full background (only on sm and up) */}
      {/* <div className="hidden sm:block fixed inset-0 -z-10 bg-[url('/hummingbird.webp')] min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" /> */}
      <ScrollSwitchBg />
      {/* Newest Posts */}
      <section
        className="min-h-1/2 py-10 px-6 backdrop-blur-sm"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        }}
      >
        <h2 className="text-4xl font-extrabold text-shadow-glow text-center text-nowrap flex items-center flex-row space-x-2 mb-12">
          <div className="w-full border border-black h-1 bg-header" />
          <p>New Posts</p>
          <div className="w-full border border-black h-1 bg-header" />
        </h2>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {newestPosts?.map((blog) => (
            <li key={blog.id}>
              <BlogCardServer
                blog={blog}
                CardComponent={BlogCard}
                extraProps={{
                  childProps: {
                    className:
                      "bg-header border-white border-1 rounded-md hover:shadow-md",
                  },
                }}
                className="bg-transparent border-none shadow-none hover:shadow-none"
              />
            </li>
          ))}
        </ul>
        <div className="h-12" />
      </section>

      {/* Posts by Genre */}
      {postsByGenre.map(({ genre, posts }, i) => {
        return (
          <section
            key={genre}
            className="min-h-1/2 py-10 px-6 backdrop-blur-sm mt-75 gap-8"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
            }}
          >
            <h2 className="text-4xl font-extrabold text-shadow-glow text-center text-nowrap flex flex-row items-center space-x-2 mb-12">
              <div className="w-full border border-black h-1 bg-header" />
              <Link href={`/blogs/${genre}`}>
                {capitalizeFirstLetter(genre)}
              </Link>
              <div className="w-full border border-black h-1 bg-header" />
            </h2>
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {posts?.map((blog) => (
                <li key={blog.id}>
                  <BlogCardServer
                    blog={blog}
                    CardComponent={BlogCard}
                    extraProps={{
                      childProps: {
                        className:
                          "bg-header border-white border-1 rounded-md hover:shadow-md",
                      },
                    }}
                    className="bg-transparent border-none shadow-none hover:shadow-none"
                  />
                </li>
              ))}
            </ul>
            <div className="h-12" />
          </section>
        );
      })}

      {/* All Posts */}
      <section
        className="min-h-1/2 py-10 px-6 backdrop-blur-sm mt-75"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        }}
      >
        <h2 className="text-4xl font-extrabold text-shadow-glow text-center text-nowrap space-x-2 mb-12 flex flex-row items-center">
          <div className="w-full border border-black h-1 bg-header" />
          <Link href="blogs/all">All Blog Posts</Link>
          <div className="w-full border border-black h-1 bg-header" />
        </h2>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {posts?.slice(0, POST_LIMIT).map((blog) => (
            <li key={blog.id}>
              <BlogCardServer
                blog={blog}
                CardComponent={BlogCard}
                extraProps={{
                  childProps: {
                    className:
                      "bg-header border-white border-1 rounded-md hover:shadow-md",
                  },
                }}
                className="bg-transparent border-none shadow-none hover:shadow-none"
              />
            </li>
          ))}
        </ul>
        <div className="h-12" />
      </section>
    </div>
  );
};

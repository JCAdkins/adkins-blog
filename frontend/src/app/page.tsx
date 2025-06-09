import Break from "@/components/ui/break";
import { getFeaturedBlogs } from "@/lib/db/queries";
import { Blog } from "next-auth";
import BlogCardServer from "@/components/cards/blog-card-server";
import BlogCard from "@/components/cards/blog-card";
import localFont from "next/font/local";
import WordOfTheDayCard from "@/components/cards/WoTD-card";
import { promises as fs } from "fs";
import path from "path";

const biancha = localFont({
  src: "../fonts/Resillia.ttf",
});

type Term = {
  word: string;
  definition: string;
};

export default async function Home() {
  const filePath = path.join(
    process.cwd(),
    "src",
    "terms",
    "photography_terms.json",
  );
  const file = await fs.readFile(filePath, "utf8");
  const terms: Term[] = JSON.parse(file);
  const today = new Date().toISOString().split("T")[0]; // e.g. "2025-06-08"
  const hash = [...today].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % terms.length;
  const term = terms[index];
  // Fetch the featured blog posts directly in the component
  const featuredPosts: Blog[] | null = await getFeaturedBlogs();

  return (
    <div className="grid min-h-screen w-full grid-rows-[1fr_20px] items-start justify-items-center gap-16 overflow-x-hidden font-[family-name:var(--font-geist-sans)] sm:p-12">
      <main className="row-start-1 flex w-full max-w-5/6 flex-col items-center gap-[16px] pt-6 sm:items-start sm:px-8">
        <h1 className="flex w-full items-center text-center text-2xl">
          <div className="border-login-hover h-[1px] w-full border" />
          <div
            className={`px-2 text-xl font-bold text-nowrap sm:text-3xl ${biancha.className} text-login-hover`}
          >
            The Blogging Photographer
          </div>
          <div className="border-login-hover h-[1px] w-full border" />
        </h1>
        <div className="">
          Welcome to my journey into the wonder world of photography! I received
          my first DSLR on Christmas of 2024 and will be uploading my pictures
          onto this blog to document the learning process and track my progress.
          Along the way I will share my thoughts and share any tips I learn that
          I believe will help you if you are just starting your own journey. So,
          thank you for stopping by and viewing the site. If you want to provide
          any feedback please don't heesitate to reach out. :)
        </div>
        <Break className="border-login-hover w-full" />
        <div className="space-y-4">
          <WordOfTheDayCard term={term} />
        </div>
        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPosts?.map((blog, ind) => (
            <BlogCardServer key={ind} blog={blog} CardComponent={BlogCard} />
          ))}
        </div>
      </main>
      <footer className="row-start-2 flex flex-wrap items-center justify-center gap-[24px]">
        © {new Date().getFullYear()} Adkins Ninja Blog
      </footer>
    </div>
  );
}

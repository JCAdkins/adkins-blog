import { getHomeViewModel } from "@/view-models/home/getHomeViewModel";
import BlogCardServer from "@/components/cards/blog-card-server";
import WordOfTheDayCard from "@/components/cards/WoTD-card";
import Break from "@/components/ui/break";
import BlogCard from "@/components/cards/blog-card";
import localFont from "next/font/local";

// views/home/HomeView.tsx
const biancha = localFont({
  src: "../fonts/Resillia.ttf",
});

export default async function HomePage() {
  const { featuredPosts, term } = await getHomeViewModel();
  return (
    <div className="grid min-h-screen w-full grid-rows-[1fr_20px] bg-red-200/50 items-start justify-items-center gap-16 overflow-x-hidden font-(family-name:--font-geist-sans) sm:p-12">
      <main className="row-start-1 flex w-full max-w-5/6 flex-col items-center gap-4 pt-6 sm:items-start sm:px-8 z-10">
        <h1 className="flex w-full items-center text-center text-2xl">
          <div className="border-login-hover h-px w-full border" />
          <div
            className={`px-2 text-xl font-bold text-nowrap sm:text-3xl ${biancha.className} text-login-hover`}
          >
            The Blogging Photographer
          </div>
          <div className="border-login-hover h-px w-full border" />
        </h1>
        <div className="z-10 text-login-hover text-4xl">
          Welcome to my journey into the wonder world of photography! I received
          my first DSLR on Christmas of 2024 and will be uploading my pictures
          onto this blog to document the learning process and track my progress.
          Along the way I will share my thoughts and share any tips I learn that
          I believe will help you if you are just starting your own journey. So,
          thank you for stopping by and viewing the site. If you want to provide
          any feedback please don&apos;t hesitate to reach out. 😊
        </div>
        <Break className="border-login-hover w-full" />
        <div className="space-y-4">
          <WordOfTheDayCard term={term} />
        </div>
        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPosts?.map((blog, ind) => (
            <BlogCardServer
              key={ind}
              blog={blog}
              CardComponent={BlogCard}
              className="border-none shadow-none bg-transparent hover:backdrop-blur rounded-md"
            />
          ))}
        </div>
      </main>
      <footer className="row-start-2 flex flex-wrap items-center justify-center gap-6">
        © {new Date().getFullYear()} Adkins Ninja Blog
      </footer>
    </div>
  );
}

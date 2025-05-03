import Break from "@/components/ui/break";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface Image {
  id: number;
  url: string;
  blogPostId: string;
}

// Define types for the fetched blog post data
interface BlogPost {
  id: string;
  title: string;
  description: string;
  images: Image[];
  featured: boolean;
}

export default async function Home() {
  // Fetch the featured blog posts directly in the component
  const response = await fetch(`${process.env.BASE_URL}/blog/featured`);
  console.log("res: ", response);
  const featuredPosts: BlogPost[] = await response.json();

  return (
    <div className="grid min-h-screen grid-rows-[1fr_20px] items-start justify-items-center gap-16 p-4 font-[family-name:var(--font-geist-sans)] sm:p-12">
      <main className="row-start-1 flex flex-col items-center gap-[16px] px-16 sm:items-start">
        <h1 className="flex w-full items-center text-center text-2xl">
          <div className="h-[1px] w-full border border-red-300" />
          <div className="px-2 text-nowrap text-red-400">
            The Blogging Photographer
          </div>
          <div className="h-[1px] w-full border border-red-300" />
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
        <Break className="border-red-300 px-16" />
        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.map((post) => {
            return (
              <Card key={post.id} className="text-black">
                <Link href={`/posts/${post.id}`} className="block">
                  <img
                    src={
                      post.images[0].url ||
                      "https://www.lvvr.com/featured-listings/application/modules/themes/views/default/assets/images/image-placeholder.png"
                    } // Fallback image if no image available
                    alt={post.title}
                    className="mb-4 h-32 w-full rounded object-cover"
                  />
                  <h2 className="text-lg font-bold">{post.title}</h2>
                  <p className="text-sm text-gray-600">{post.description}</p>
                </Link>
              </Card>
            );
          })}
        </div>
      </main>
      <footer className="row-start- flex flex-wrap items-center justify-center gap-[24px]">
        © {new Date().getFullYear()} Adkins Ninja Blog
      </footer>
    </div>
  );
}

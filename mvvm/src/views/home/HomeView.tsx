import BlogCard from "@/components/cards/blog-card";
import BlogCardServer from "@/components/cards/blog-card-server";
import WordOfTheDayCard from "@/components/cards/WoTD-card";
import { Blog, Term } from "next-auth";

// views/home/HomeView.tsx

export function HomeView({
  featuredPosts,
  term,
}: {
  featuredPosts: Blog[] | null;
  term: Term;
}) {
  return (
    <>
      <WordOfTheDayCard term={term} />
      <div className="grid ...">
        {featuredPosts?.map((blog, i) => (
          <BlogCardServer key={i} blog={blog} CardComponent={BlogCard} />
        ))}
      </div>
    </>
  );
}

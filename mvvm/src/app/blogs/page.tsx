import { useBlogsViewModel } from "@/view-models/blog/useBlogsViewModel";
import { BlogsView } from "@/views/blog/BlogsView";

export default async function BlogsPage() {
  const vm = await useBlogsViewModel();

  return <BlogsView {...vm} />;
}

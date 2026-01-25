import { getBlogPostPageViewModel } from "@/view-models/blog/useBlogPostViewModel";
import { BlogPostView } from "@/views/blog/BlogPostView";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function BlogPostPage({ params, searchParams }: Props) {
  const vm = await getBlogPostPageViewModel({ params, searchParams });
  return <BlogPostView {...vm} />;
}

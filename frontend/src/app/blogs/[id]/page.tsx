import BlogPostContent from "@/components/containers/blog-post-content"; // client component
import { CommentsSection } from "@/components/containers/comments-section";

type Props = {
  params: { id: string };
};

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BlogPostContent id={id} />
      <CommentsSection blogId={id} />
    </div>
  );
}

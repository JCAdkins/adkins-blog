import BlogPostContent from "@/components/containers/blog-post-content"; // client component
import { CommentsSection } from "@/components/containers/comments-section";
import { CommentsProvider } from "@/contexts/comments-context";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function BlogPostPage({ params, searchParams }: Props) {
  const { commentId } = await searchParams;
  const { id } = await params;
  return (
    <CommentsProvider blogId={id} highlightedCommentId={commentId}>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <BlogPostContent id={id} />
        <CommentsSection blogId={id} highlightedCommentId={commentId} />
      </div>
    </CommentsProvider>
  );
}

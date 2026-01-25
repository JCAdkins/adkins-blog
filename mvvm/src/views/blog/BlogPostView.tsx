import BlogPostContent from "@/components/containers/blog-post-content";
import { CommentsSection } from "@/components/containers/comments-section";
import { CommentsProvider } from "@/contexts/comments-context";

interface BlogPostViewProps {
  id: string;
  commentId?: string;
}

export const BlogPostView = ({ id, commentId }: BlogPostViewProps) => {
  return (
    <CommentsProvider blogId={id} highlightedCommentId={commentId}>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <BlogPostContent id={id} />
        <CommentsSection blogId={id} highlightedCommentId={commentId} />
      </div>
    </CommentsProvider>
  );
};

import BlogPostContent from "@/components/containers/blog-post-content";
import { CommentsSection } from "@/components/containers/comments-section";
import { CommentsProvider } from "@/contexts/comments-context";
import { getBlogPostPageViewModel } from "@/view-models/blog/useBlogPostViewModel";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function BlogPostPage({ params, searchParams }: Props) {
  const { id, highlightedCommentId } = await getBlogPostPageViewModel({
    params,
    searchParams,
  });
  return (
    <CommentsProvider blogId={id} highlightedCommentId={highlightedCommentId}>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <BlogPostContent id={id} />
        <CommentsSection
          blogId={id}
          highlightedCommentId={highlightedCommentId}
        />
      </div>
    </CommentsProvider>
  );
}

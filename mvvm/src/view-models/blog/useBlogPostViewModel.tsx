type ViewModelInput = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function getBlogPostPageViewModel({
  params,
  searchParams,
}: ViewModelInput) {
  const [{ id }, { commentId }] = await Promise.all([params, searchParams]);

  return {
    id: id,
    highlightedCommentId: commentId,
  };
}

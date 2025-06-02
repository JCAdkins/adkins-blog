import BlogPostContent from "@/components/containers/blog-post-content"; // client component

type Props = {
  params: { id: string };
};

export default async function BlogPostPage({ params }: Props) {
  const { id } = params;
  console.log("id: ", id);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BlogPostContent id={id} />
    </div>
  );
}

// app/posts/[id]/page.tsx

import { getBlogById, getImmichAsset } from "@/lib/db/queries"; // adjust to your actual path
import { notFound } from "next/navigation";
import Image from "next/image";
import { Blog } from "next-auth";

type Props = {
  params: {
    id: string;
  };
};

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const post: Blog = await getBlogById(id); // You should have this or a similar function
  const images = await Promise.all(
    post.blogPostImages?.map(async (data) => {
      return await getImmichAsset({
        type: "original",
        id: data.imageId,
      });
    }) ?? [],
  );

  if (!post) return notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      <p className="mb-6 text-gray-500">{post.description}</p>

      {/* If you store HTML or markdown, render accordingly */}
      <div className="prose prose-lg dark:prose-invert">{post.content}</div>

      {images.length > 0 && (
        <div className="mt-8 space-y-4">
          {images.map((image, index) =>
            image ? (
              <Image
                key={index}
                src={image}
                alt={`Blog image ${index + 1}`}
                width={800}
                height={600}
              />
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}

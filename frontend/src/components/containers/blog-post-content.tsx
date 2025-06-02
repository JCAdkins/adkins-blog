"use client";

import { useEffect, useState } from "react";
import { getBlogById, getImmichAsset } from "@/lib/db/queries";
import { formatDateToMMDDYYYY } from "@/lib/utils";
import ImageGallery from "@/components/containers/image-container";
import { Blog, BlogPostImage } from "next-auth";
import BlogContentSkeleton from "../skeletons/blog-content-skeleton";
import BlogImageSkeleton from "../skeletons/blog-image-skeleton";
import React from "react";

type Props = {
  id: string;
};

export default function BlogPostContent({ id }: Props) {
  const [post, setPost] = useState<Blog | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getBlogById(id);
      setPost(data);

      if (data?.blogPostImages?.length) {
        const imgs = await Promise.all(
          data.blogPostImages.map((img: BlogPostImage) =>
            getImmichAsset({ type: "original", id: img.imageId }),
          ),
        );
        setImages(imgs);
      }

      setLoadingImages(false);
    }

    fetchData();
  }, [id]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {!post ? (
        <BlogContentSkeleton />
      ) : (
        <>
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <p className="mb-4 text-gray-500">
            created on {formatDateToMMDDYYYY(post.createdAt)}
          </p>
          <p className="mb-6 text-gray-500">{post.description}</p>
          <div className="prose prose-lg dark:prose-invert">
            {post.content.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
        </>
      )}

      <div className="mt-8">
        {loadingImages ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <BlogImageSkeleton key={i} />
            ))}
          </div>
        ) : (
          images.length > 0 && <ImageGallery images={images} />
        )}
      </div>
    </div>
  );
}

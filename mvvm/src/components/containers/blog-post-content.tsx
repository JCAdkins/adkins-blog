"use client";

import { useEffect, useState } from "react";
import { getBlogById } from "@/lib/db/queries";
import { getImmichAsset } from "@/lib/services/immich-service";
import { formatDateToMMDDYYYY } from "@/lib/utils";
import ImageGallery from "@/components/containers/image-container";
import BlogContentSkeleton from "../skeletons/blog-content-skeleton";
import BlogImageSkeleton from "../skeletons/blog-image-skeleton";
import React from "react";
import { Blog } from "@/models/blog/blogModel";
import { BlogPostImage } from "@/models/blog/blogPostImageModel";

type Props = {
  id: string;
};

export default function BlogPostContent({ id }: Props) {
  const [post, setPost] = useState<Blog | null>(null);
  const [images, setImages] = useState<
    ({ thumbnail: string; original: string } | undefined)[]
  >([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getBlogById(id);
      setPost(data);

      if (data?.blogPostImages?.length) {
        // const imgs = await Promise.all(
        //   data.blogPostImages.map(async (img: BlogPostImage) => {
        //     const [thumbnail, original] = await Promise.all([
        //       getImmichAsset({ type: "thumbnail", id: img.imageId }),
        //       getImmichAsset({ type: "original", id: img.imageId }),
        //     ]);
        //     return { thumbnail, original };
        //   }),
        // );
        const imgs = data.blogPostImages.map((img: BlogPostImage) => ({
          thumbnail: `https://immich.adkins.ninja/api/assets/${img.imageId}/thumbnail?key=${data.immichShareToken}`,
          original: `https://immich.adkins.ninja/api/assets/${img.imageId}/original?key=${data.immichShareToken}`,
        }));
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

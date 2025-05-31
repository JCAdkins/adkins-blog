// src/components/cards/BlogCard.tsx (Client Component)
"use client";

import Link from "next/link";
import { Card } from "../ui/card";
import { Blog } from "next-auth";

export default function BlogCard({
  blog,
  imageUrl,
}: {
  blog: Blog;
  imageUrl: string | undefined;
}) {
  return (
    <Card
      key={blog.id}
      className="bg-login text-black sm:transition-transform sm:duration-50 sm:hover:scale-[1.02]"
    >
      <Link href={`/posts/${blog.id}`} className="block">
        <img
          src={
            imageUrl ||
            "https://www.lvvr.com/featured-listings/application/modules/themes/views/default/assets/images/image-placeholder.png"
          }
          alt={blog.title}
          className="mb-4 h-32 w-full rounded object-cover"
        />
        <h2 className="text-lg font-bold">{blog.title}</h2>
        <p className="text-sm text-gray-600">{blog.description}</p>
      </Link>
    </Card>
  );
}

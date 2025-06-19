// src/components/cards/BlogCard.tsx (Client Component)
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { Blog } from "next-auth";
import Image from "next/image";

export default function BlogCard({
  blog,
  imageUrl,
  className = "",
}: {
  blog: Blog;
  imageUrl?: string;
  className?: string;
}) {
  return (
    <Card
      key={blog.id}
      className={cn(
        "bg-login text-black sm:transition-transform sm:duration-50 sm:hover:scale-[1.02]",
        className
      )}
    >
      <Link href={`/blogs/${blog.id}`} className="block">
        <Image
          src={
            imageUrl ||
            "https://www.lvvr.com/featured-listings/application/modules/themes/views/default/assets/images/image-placeholder.png"
          }
          width={30}
          height={10}
          alt={blog.title}
          className="mb-4 h-32 w-full rounded object-cover"
        />
        <h2 className="text-lg font-bold">{blog.title}</h2>
        <p className="text-sm text-gray-600">{blog.description}</p>
      </Link>
    </Card>
  );
}

// src/components/cards/BlogCard.tsx (Client Component)
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import Image from "next/image";
import { Blog } from "@/models/blog/blogModel";

export default function BlogCard({
  blog,
  imageUrl,
  className = "",
  childProps = {},
}: {
  blog: Blog;
  imageUrl?: string;
  className?: string;
  childProps?: {};
}) {
  return (
    <Card
      key={blog.id}
      className={cn(
        "text-black sm:transition-transform sm:duration-50 sm:hover:scale-[1.02]",
        className,
      )}
    >
      <div {...childProps}>
        <Link href={`/blog/${blog.id}`} className="block">
          <div className="relative mb-4 h-32 w-full overflow-hidden rounded">
            <Image
              src={imageUrl || "/placeholder-img.png"}
              fill
              alt={blog.title}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="p-2">
            <h2 className="text-lg font-bold">{blog.title}</h2>
            <p className="text-sm text-gray-600">{blog.description}</p>
          </div>
        </Link>
      </div>
    </Card>
  );
}

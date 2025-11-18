// src/components/cards/BlogCard.tsx (Client Component)
"use client";

import Link from "next/link";
import { cn, formatDateToMMDDYYYY } from "@/lib/utils";
import { Card } from "../ui/card";
import { Blog } from "next-auth";
import Image from "next/image";

export default function BlogCard({
  blog,
  imageUrl,
  className = "",
  childProps = {},
  canEdit = false,
}: {
  blog: Blog;
  imageUrl?: string;
  className?: string;
  childProps?: {};
  canEdit?: boolean;
}) {
  console.log("childProps: ", childProps);
  return (
    <Card
      key={blog.id}
      className={cn(
        "text-black sm:transition-transform sm:duration-50 sm:hover:scale-[1.02]",
        className
      )}
    >
      <div {...childProps} className="h-full flex flex-col">
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
        <div className="flex flex-col justify-between flex-1 p-2">
          <div>
            <h2 className="text-lg font-bold">{blog.title}</h2>
            <p className="text-sm text-gray-600 pb-2">{blog.description}</p>
          </div>
          {canEdit && (
            <div className="flex flex-row justify-between pt-2 border-t border-black">
              <div>{formatDateToMMDDYYYY(blog.createdAt)}</div>
              <Link
                href={`/admin/blogs/${blog.id}`}
                className="text-blue-700 hover:underline"
              >
                Edit
              </Link>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

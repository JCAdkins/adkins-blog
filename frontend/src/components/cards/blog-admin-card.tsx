"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card"; // Adjust the import path as needed
import { formatDateToMMDDYYYY } from "@/lib/utils";
import { Blog } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export default function BlogAdminCard({
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
      className={cn(
        "bg-login text-black sm:transition-transform sm:duration-50 sm:hover:scale-[1.02]",
        className
      )}
      key={blog.id}
      header={blog.title}
      footer={
        <div className="flex w-full justify-between">
          <p className="text-sm">
            Created at {formatDateToMMDDYYYY(blog.createdAt)}
          </p>
          <Link
            href={`/admin/posts/${blog.id}`}
            className="text-blue-700 hover:underline"
          >
            Edit
          </Link>
        </div>
      }
    >
      <div className="flex-col">
        <Image
          src={
            imageUrl ||
            "https://www.lvvr.com/featured-listings/application/modules/themes/views/default/assets/images/image-placeholder.png"
          }
          height={10}
          width={30}
          alt={blog.title}
          className="mb-4 h-32 w-full rounded object-cover"
        />
        <div>{blog.description}</div>
      </div>
    </Card>
  );
}

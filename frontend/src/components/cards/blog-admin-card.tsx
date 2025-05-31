"use client";

import { Card } from "@/components/ui/card"; // Adjust the import path as needed
import { formatDateToMMDDYYYY } from "@/lib/utils";
import { Blog } from "next-auth";
import Link from "next/link";

export default function BlogAdminCard({
  blog,
  imageUrl,
}: {
  blog: Blog;
  imageUrl: string | undefined;
}) {
  return (
    <Card
      className="bg-login text-black sm:transition-transform sm:duration-50 sm:hover:scale-[1.02]"
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
        <img
          src={
            imageUrl ||
            "https://www.lvvr.com/featured-listings/application/modules/themes/views/default/assets/images/image-placeholder.png"
          }
          alt={blog.title}
          className="mb-4 h-32 w-full rounded object-cover"
        />
        <div>{blog.description}</div>
      </div>
    </Card>
  );
}

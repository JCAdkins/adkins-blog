import { Blog } from "next-auth"; // your custom augmentation
import { Card } from "../ui/card";
import Link from "next/link";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card key={blog.id} className="text-black">
      <Link href={`/posts/${blog.id}`} className="block">
        <img
          src={
            blog.images?.[0]?.url ||
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

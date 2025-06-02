import BlogContentSkeleton from "./blog-content-skeleton";
import BlogImageSkeleton from "./blog-image-skeleton";

export default function BlogPostSkeleton() {
  return (
    <div className="space-y-4">
      <BlogContentSkeleton />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <BlogImageSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

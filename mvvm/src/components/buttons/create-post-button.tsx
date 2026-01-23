import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function CreatePostButton() {
  return (
    <Button
      asChild
      variant="default"
      size="sm"
      className={cn(
        "bg-login/90 hover:bg-login-hover/90 hover:shadow-header ml-auto text-white shadow-lg transition-all duration-100"
      )}
    >
      <Link href="/admin/blogs/create">+ Create Post</Link>
    </Button>
  );
}

import Link from "next/link";
import { Button } from "../ui/button";

export default function CreatePostButton() {
  return (
    <Button
      asChild
      className="bg-header hover:bg-login gap-0 rounded-xl shadow-md outline transition"
    >
      <Link href="/admin/posts/create">+ Create Post</Link>
    </Button>
  );
}

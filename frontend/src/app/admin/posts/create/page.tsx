import CreatePostForm from "@/components/forms/create-post-form";
import { createPost } from "../../actions";

export default function CreatePostPage() {
  return (
    <div className="mx-auto max-w-2xl py-10">
      <h1 className="mb-6 text-center text-2xl font-bold">Create New Post</h1>
      <CreatePostForm action={createPost} />
    </div>
  );
}

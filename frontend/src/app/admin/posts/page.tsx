import BlogAdminCard from "@/components/cards/blog-admin-card";
import { getAllBlogs } from "@/lib/db/queries";
import { Blog } from "next-auth";

const AdminPosts = async () => {
  const blogs: Blog[] | null = await getAllBlogs();
  console.log("Bloogs: ", blogs);
  return (
    <div className="grid grid-cols-1 gap-6 text-amber-300 md:grid-cols-2">
      {blogs?.map((blog) => <BlogAdminCard key={blog.id} blog={blog} />)}
    </div>
  );
};

export default AdminPosts;

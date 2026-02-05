import BlogAdminCard from "@/components/cards/blog-admin-card";
import BlogCardServer from "@/components/cards/blog-card-server";
import { getAllBlogs } from "@/lib/db/queries";
import { Blog } from "next-auth";

const Admin = async () => {
  const blogs: Blog[] | null = await getAllBlogs();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs?.map((blog, ind) => (
        <BlogCardServer
          key={ind}
          blog={blog}
          CardComponent={BlogAdminCard}
          extraProps={{ canEdit: false }}
          className="rounded-md border-none cursor-pointer"
        />
      ))}
    </div>
  );
};

export default Admin;

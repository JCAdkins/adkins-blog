import BlogAdminCard from "@/components/cards/blog-admin-card";
import BlogCardServer from "@/components/cards/blog-card-server";
import { getAllBlogs } from "@/lib/db/queries";
import { Blog } from "next-auth";

const Admin = async () => {
  const handleDelete = () => {
    console.log("We need to handle deleting the blog card.");
  };

  const blogs: Blog[] | null = await getAllBlogs();
  return (
    <div className="grid grid-cols-1 gap-6 text-amber-300 md:grid-cols-2">
      {blogs?.map((blog, ind) => (
        <BlogCardServer
          key={ind}
          blog={blog}
          CardComponent={BlogAdminCard}
          extraProps={{ canEdit: true }}
        />
      ))}
    </div>
  );
};

export default Admin;

import BlogAdminCard from "@/components/cards/blog-admin-card";
import BlogCardServer from "@/components/cards/blog-card-server";
import PhotoEditor from "@/components/editor";
import { getAllBlogs } from "@/lib/db/queries";
import { Blog } from "next-auth";

const Admin = async () => {
  const blogs: Blog[] | null = await getAllBlogs();
  return (
    // <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    //   {blogs?.map((blog, ind) => (
    //     <BlogCardServer
    //       key={ind}
    //       blog={blog}
    //       CardComponent={BlogAdminCard}
    //       extraProps={{ canEdit: true }}
    //     />
    //   ))}
    // </div>
    <div className="flex h-max w-full justify-center">
      <PhotoEditor />
    </div>
  );
};

export default Admin;

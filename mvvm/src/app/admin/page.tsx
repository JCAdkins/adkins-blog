// No 'use client' here — stays server-rendered
import { getAllBlogs, getUserStats, getCommentStats } from "@/lib/db/queries";
import BlogCardServer from "@/components/cards/blog-card-server";
import { DashboardCharts } from "@/components/charts/dashboard-charts"; // ← import the client component
import { Card } from "@/components/ui/card";
import BlogCard from "@/components/cards/blog-admin-card";
import { Blog } from "next-auth";

const Admin = async () => {
  const blogs = await getAllBlogs();
  const userStatsRes = await getUserStats();
  if ("error" in userStatsRes) {
    console.error("Error fetching user stats:", userStatsRes.error);
    return <div className="p-6">Error loading user stats</div>;
  }
  const {
    totalUsers,
    activeUsers,
    newUsersThisWeek,
    newUsersThisMonth,
    usersPerDay,
    usersPerMonth,
    topActiveUsers,
  } = userStatsRes;
  const userStats = userStatsRes;
  const commentStatsRes = await getCommentStats();
  if ("error" in commentStatsRes) {
    console.error("Error fetching comment stats:", commentStatsRes.error);
    return <div className="p-6">Error loading comment stats</div>;
  }
  const {
    totalComments,
    totalReplies,
    totalTopLevelComments,
    avgCommentsPerBlog,
    topCommentedBlogs,
    commentsPerDay,
    commentsPerMonth,
  } = commentStatsRes;

  const blogGrowthData = [
    { name: "Jan", blogs: 12 },
    { name: "Feb", blogs: 19 },
  ];

  return (
    <div className="space-y-8 p-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-black border-none">
            <p className="flex justify-center">
              Total Users: {totalUsers ?? 0}
            </p>
          </Card>
          <Card className="text-black border-none">
            <p className="flex justify-center">
              Total Blogs: {blogs?.length ?? 0}
            </p>
          </Card>
          <Card className="text-black border-none">
            <p className="flex justify-center">
              Total Comments: {totalComments ?? 0}
            </p>
          </Card>
        </div>
      </section>

      {/* Client-side charts */}
      <DashboardCharts blogGrowthData={blogGrowthData} />

      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Blogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs
            ?.filter((blog: Blog) => {
              const oneWeekAgo = new Date();
              oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
              return new Date(blog.createdAt) >= oneWeekAgo;
            })
            .map((blog: Blog) => (
              <BlogCardServer
                key={blog.id}
                blog={blog}
                CardComponent={BlogCard} // assuming you meant this
                extraProps={{ canEdit: true }} // adjust as needed
                className="rounded-md border-none cursor-pointer"
              />
            ))}
        </div>
      </section>
    </div>
  );
};

export default Admin;

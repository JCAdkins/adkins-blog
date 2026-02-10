import { Card } from "@/components/ui/card";
import { Table } from "@radix-ui/themes";
import { Badge } from "@/components/ui/badge";
import { getCommentStats, getUserStats } from "@/lib/db/queries";
import { DashboardCharts } from "@/components/charts/dashboard-charts";

export default async function AdminDashboard() {
  const userStats = await getUserStats();
  const commentStats = await getCommentStats();

  if ("error" in commentStats || "error" in userStats) {
    return <div className="p-6 text-red-600">Error loading dashboard data</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-10">
      {/* ── Overview KPIs ── */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Overview</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="text-black h-fit" header="Total Users">
            <div className="flex justify-center text-3xl font-bold pb-2">
              {userStats.totalUsers}
            </div>
          </Card>

          <Card className="text-black h-fit" header="Active Users (30d)">
            <div className="flex justify-center text-3xl font-bold pb-2">
              {userStats.activeUsers}
            </div>
          </Card>

          <Card className="text-black h-fit" header="Total Comments">
            <div className="pb-2">
              <div className="flex justify-center text-3xl font-bold">
                {commentStats.totalComments}
              </div>
              <p className="flex justify-center text-md text-muted-foreground">
                {commentStats.totalReplies} replies
              </p>
            </div>
          </Card>

          <Card className="text-black h-fit" header="Avg Comments/Blog">
            <div className="flex justify-center text-3xl font-bold pb-2">
              {commentStats.avgCommentsPerBlog.toFixed(1)}
            </div>
          </Card>
        </div>
      </section>

      {/* ── Growth Charts ── */}
      <section>
        <h2 className="text-2xl text-black font-semibold mb-6">
          Growth & Activity
        </h2>
        <DashboardCharts
          usersPerDay={userStats.usersPerDay}
          usersPerMonth={userStats.usersPerMonth}
          commentsPerDay={commentStats.commentsPerDay}
          commentsPerMonth={commentStats.commentsPerMonth}
        />
      </section>

      {/* ── Top Users & Blogs ── */}
      <section className="grid gap-8 md:grid-cols-2">
        {/* Top Active Users */}
        <Card className="text-black" header="Top Active Users">
          <div className="flex justify-center">
            <Table.Root variant="surface" size="2">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="px-2">
                    Username
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="px-2" align="right">
                    Comments
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="px-2" align="right">
                    Blogs
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {userStats.topActiveUsers.map(
                  ({ id, username, _count }: any) => (
                    <Table.Row className="even:bg-gray-300 px-2" key={id}>
                      <Table.Cell className="font-medium px-2 text-center">
                        {username}
                      </Table.Cell>
                      <Table.Cell className="px-2 text-center" align="right">
                        {_count?.Comment ?? 0}
                      </Table.Cell>
                      <Table.Cell className="px-2 text-center" align="right">
                        {_count?.Like ?? 0}
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
              </Table.Body>
            </Table.Root>
          </div>
        </Card>

        {/* Top Commented Blogs */}
        <Card className="text-black" header="Most Commented Blogs">
          <div className="flex justify-center">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="right">
                    Comments
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {commentStats.topCommentedBlogs.map(
                  ({ id, title, _count }: any) => (
                    <Table.Row className="even:bg-gray-300" key={id}>
                      <Table.Cell className="font-medium px-2">
                        {title}
                      </Table.Cell>
                      <Table.Cell className="px-2 text-center" align="right">
                        <Badge variant="secondary">
                          {_count?.Comment ?? 0}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
              </Table.Body>
            </Table.Root>
          </div>
        </Card>
      </section>

      {/* Quick stats line */}
      <Card className="text-muted-foreground text-center" header="Quick Stats">
        <p>
          New users this week: <strong>{userStats.newUsersThisWeek}</strong>
        </p>
        <p>
          This month: <strong>{userStats.newUsersThisMonth}</strong>
        </p>
      </Card>
    </div>
  );
}

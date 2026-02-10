import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*** =====================================================================*
 *  Users Stats Service Functions
 * ======================================================================*/

export async function getTotalUsers() {
  const totalUsers = await prisma.user.count();
  return totalUsers;
}

export async function getActiveUsers() {
  const activeUsers = await prisma.user.count({
    where: {
      lastLoginAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  });
  return activeUsers;
}

export async function getNewUsersThisWeek() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newUsersThisWeek = await prisma.user.count({
    where: {
      createdAt: {
        gte: oneWeekAgo,
      },
    },
  });
  return newUsersThisWeek;
}

export async function getNewUsersThisMonth() {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const newUsersThisMonth = await prisma.user.count({
    where: {
      createdAt: {
        gte: oneMonthAgo,
      },
    },
  });
  return newUsersThisMonth;
}

export async function getUsersPerDay() {
  const usersPerDayRaw = await prisma.$queryRawUnsafe<
    Array<{ date: string; count: number }>
  >(`
    SELECT 
      DATE("createdAt") AS date,
      COUNT(*) AS count
    FROM "User"
    WHERE "createdAt" >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE("createdAt")
    ORDER BY date ASC;
  `);

  // Convert to nicer format for frontend charting (e.g. Recharts)
  const usersPerDay = usersPerDayRaw.map((row) => ({
    date: row.date.toString().split("T")[0], // '2025-12-01'
    users: Number(row.count),
  }));

  return usersPerDay;
}

export async function getUsersPerMonth() {
  const usersPerMonthRaw = await prisma.$queryRawUnsafe<
    Array<{ year: number; month: number; count: number }>
  >(`
    SELECT 
      EXTRACT(YEAR FROM "createdAt") AS year,
      EXTRACT(MONTH FROM "createdAt") AS month,
      COUNT(*) AS count
    FROM "User"
    WHERE "createdAt" >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY year, month
    ORDER BY year DESC, month DESC;
  `);

  const usersPerMonth = usersPerMonthRaw.map((row) => ({
    month: `${row.year}-${String(row.month).padStart(2, "0")}`,
    users: Number(row.count),
  }));

  return usersPerMonth;
}

export async function getTopActiveUsers() {
  const topActiveUsers = await prisma.user.findMany({
    take: 5,
    orderBy: {
      Comment: { _count: "desc" },
    },
    select: {
      id: true,
      username: true,
      email: true,
      lastLoginAt: true,
      _count: {
        select: { Comment: true, Like: true },
      },
    },
  });
  return topActiveUsers;
}

/*** =====================================================================*
 * Comment Stats Service Functions
 * ======================================================================*/

export const getTotalComments = async () => {
  const totalComments = await prisma.comment.count();
  return totalComments;
};

export const getTotalReplies = async () => {
  const totalReplies = await prisma.comment.count({
    where: { parentId: { not: null } },
  });
  return totalReplies;
};

export const getAverageCommentsPerBlog = async () => {
  const result = await prisma.comment.groupBy({
    by: ["postId"],
    _count: {
      postId: true,
    },
  });

  if (result.length === 0) return 0;

  const totalComments = result.reduce(
    (acc, curr) => acc + curr._count.postId,
    0,
  );
  return totalComments / result.length;
};

export const getTopCommentedBlogs = async () => {
  const topCommentedBlogs = await prisma.blogPost.findMany({
    take: 5,
    orderBy: {
      Comment: { _count: "desc" },
    },
    select: {
      id: true,
      title: true,
      _count: { select: { Comment: true } },
    },
  });
  return topCommentedBlogs;
};

export const getCommentsPerDay = async () => {
  const commentsPerDayRaw = await prisma.$queryRawUnsafe<
    Array<{ date: string; count: number }>
  >(`
    SELECT 
      DATE("createdAt") AS date,
      COUNT(*) AS count
    FROM "Comment"
    WHERE "createdAt" >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE("createdAt")
    ORDER BY date ASC;
  `);

  const commentsPerDay = commentsPerDayRaw.map((row) => ({
    date: row.date.toString().split("T")[0],
    comments: Number(row.count),
  }));
  return commentsPerDay;
};

export const getCommentsPerMonth = async () => {
  const commentsPerMonthRaw = await prisma.$queryRawUnsafe<
    Array<{ year: number; month: number; count: number }>
  >(`
    SELECT 
      EXTRACT(YEAR FROM "createdAt") AS year,
      EXTRACT(MONTH FROM "createdAt") AS month,
      COUNT(*) AS count
    FROM "Comment"
    WHERE "createdAt" >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY year, month
    ORDER BY year DESC, month DESC;
  `);

  const commentsPerMonth = commentsPerMonthRaw.map((row) => ({
    month: `${row.year}-${String(row.month).padStart(2, "0")}`,
    comments: Number(row.count),
  }));
  return commentsPerMonth;
};

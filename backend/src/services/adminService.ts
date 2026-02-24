import { db } from "../lib/prisma.js";

/*** =====================================================================*
 *  Users Stats Service Functions
 * ======================================================================*/

export async function getTotalUsers() {
  const totalUsers = await db.user.count();
  return totalUsers;
}

export async function getActiveUsers() {
  const activeUsers = await db.user.count({
    where: {
      lastLoginAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  });
  return activeUsers;
}

export async function getNewUsersThisWeek() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newUsersThisWeek = await db.user.count({
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
  const newUsersThisMonth = await db.user.count({
    where: {
      createdAt: {
        gte: oneMonthAgo,
      },
    },
  });
  return newUsersThisMonth;
}

export async function getUsersPerDay() {
  const usersPerDayRaw = await db.$queryRawUnsafe<
    Array<{ date: string; count: number }>
  >(`
    SELECT 
      DATE("createdAt") AS date,
      COUNT(*) AS count
    FROM "User"
    WHERE "createdAt" >= NOW() - INTERVAL '30 days'
    GROUP BY DATE("createdAt")
    ORDER BY date ASC;
  `);

  // Create lookup map
  const map = new Map<string, number>();

  usersPerDayRaw.forEach((row: any) => {
    const tKey = new Date(row.date.toString().split(" GMT")[0])
      .toISOString()
      .slice(0, 10)
      .split("-");
    const key = `${tKey[1]}-${tKey[2]}`;
    map.set(key, Number(row.count));
  });

  // Generate last 30 days
  const result = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    const tKey = d.toISOString().slice(0, 10).split("-");
    const key = `${tKey[1]}-${tKey[2]}`;

    result.push({
      date: key,
      users: map.get(key) || 0,
    });
  }

  return result;
}

export async function getUsersPerMonth() {
  const usersPerMonthRaw = await db.$queryRawUnsafe<
    Array<{ year: number; month: number; count: number }>
  >(`
    SELECT 
      EXTRACT(YEAR FROM "createdAt") AS year,
      EXTRACT(MONTH FROM "createdAt") AS month,
      COUNT(*) AS count
    FROM "User"
    WHERE "createdAt" >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY year, month
    ORDER BY year, month;
  `);

  // Convert to map for quick lookup
  const map = new Map<string, number>();

  usersPerMonthRaw.forEach((row: any) => {
    const key = `${row.year}-${String(row.month).padStart(2, "0")}`;
    map.set(key, Number(row.count));
  });

  // Generate last 12 months
  const result = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toISOString().slice(0, 7);

    result.push({
      month: key,
      users: map.get(key) || 0,
    });
  }

  return result;
}

export async function getTopActiveUsers() {
  const topActiveUsers = await db.user.findMany({
    take: 5,
    orderBy: {
      comments: { _count: "desc" },
    },
    select: {
      id: true,
      username: true,
      email: true,
      lastLoginAt: true,
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });
  return topActiveUsers;
}

/*** =====================================================================*
 * Comment Stats Service Functions
 * ======================================================================*/

export const getTotalComments = async () => {
  const totalComments = await db.comment.count();
  return totalComments;
};

export const getTotalReplies = async () => {
  const totalReplies = await db.comment.count({
    where: { parentId: { not: null } },
  });
  return totalReplies;
};

export const getAverageCommentsPerBlog = async () => {
  const result = await db.comment.groupBy({
    by: ["postId"],
    _count: {
      postId: true,
    },
  });

  if (result.length === 0) return 0;

  const totalComments = result.reduce(
    (acc: any, curr: any) => acc + curr._count.postId,
    0,
  );
  return totalComments / result.length;
};

export const getTopCommentedBlogs = async () => {
  const topCommentedBlogs = await db.blogPost.findMany({
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
  const commentsPerDayRaw = await db.$queryRawUnsafe<
    Array<{ date: string; count: number }>
  >(`
    SELECT 
      DATE("createdAt") AS date,
      COUNT(*) AS count
    FROM "Comment"
    WHERE "createdAt" >= NOW() - INTERVAL '30 days'
    GROUP BY DATE("createdAt")
    ORDER BY date ASC;
  `);

  // Map raw results for easy lookup
  const map = new Map<string, number>();
  commentsPerDayRaw.forEach((row: any) => {
    const tKey = new Date(row.date.toString().split(" GMT")[0])
      .toISOString()
      .slice(0, 10)
      .split("-");
    const key = `${tKey[1]}-${tKey[2]}`;
    map.set(key, Number(row.count));
  });

  // Generate last 30 days
  const result = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const tKey = d.toISOString().slice(0, 10).split("-");
    const key = `${tKey[1]}-${tKey[2]}`;
    result.push({
      date: key,
      comments: map.get(key) || 0,
    });
  }

  return result;
};

export const getCommentsPerMonth = async () => {
  const commentsPerMonthRaw = await db.$queryRawUnsafe<
    Array<{ year: number; month: number; count: number }>
  >(`
    SELECT 
      EXTRACT(YEAR FROM "createdAt") AS year,
      EXTRACT(MONTH FROM "createdAt") AS month,
      COUNT(*) AS count
    FROM "Comment"
    WHERE "createdAt" >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY year, month
    ORDER BY year ASC, month ASC;
  `);

  // Map raw results for easy lookup
  const map = new Map<string, number>();
  commentsPerMonthRaw.forEach((row: any) => {
    const key = `${row.year}-${String(row.month).padStart(2, "0")}`;
    map.set(key, Number(row.count));
  });

  // Generate last 12 months
  const result = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    result.push({
      month: key,
      comments: map.get(key) || 0,
    });
  }

  return result;
};

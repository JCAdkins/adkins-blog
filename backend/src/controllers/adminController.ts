import express from "express";
import {
  getActiveUsers,
  getAverageCommentsPerBlog,
  getCommentsPerDay,
  getCommentsPerMonth,
  getNewUsersThisMonth,
  getNewUsersThisWeek,
  getTopActiveUsers,
  getTopCommentedBlogs,
  getTotalComments,
  getTotalReplies,
  getTotalUsers,
  getUsersPerDay,
  getUsersPerMonth,
} from "../services/adminService.js";

export async function getUsersStats(
  _req: express.Request,
  res: express.Response,
) {
  try {
    const totalUsers = await getTotalUsers();
    const activeUsers = await getActiveUsers();
    const newUsersThisWeek = await getNewUsersThisWeek();
    const newUsersThisMonth = await getNewUsersThisMonth();
    const usersPerDay = await getUsersPerDay();
    const usersPerMonth = await getUsersPerMonth();
    const topActiveUsers = await getTopActiveUsers();

    const userStats = {
      totalUsers,
      activeUsers,
      newUsersThisWeek,
      newUsersThisMonth,
      usersPerDay,
      usersPerMonth,
      topActiveUsers,
    };

    res.status(200).json(userStats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCommentsStats(
  _req: express.Request,
  res: express.Response,
) {
  try {
    const totalComments = await getTotalComments();
    const totalReplies = await getTotalReplies();
    const totalTopLevelComments = totalComments - totalReplies;
    const avgCommentsPerBlog = await getAverageCommentsPerBlog();
    const topCommentedBlogs = await getTopCommentedBlogs();
    const commentsPerDay = await getCommentsPerDay();
    const commentsPerMonth = await getCommentsPerMonth();

    const commentStats = {
      totalComments: totalComments,
      totalReplies: totalReplies,
      totalTopLevelComments: totalTopLevelComments,
      avgCommentsPerBlog: avgCommentsPerBlog,
      topCommentedBlogs: topCommentedBlogs,
      commentsPerDay: commentsPerDay,
      commentsPerMonth: commentsPerMonth,
    };

    res.status(200).json(commentStats);
  } catch (error) {
    console.error("Error fetching comment stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

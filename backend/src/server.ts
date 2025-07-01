import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user-routes.ts";
import immichRoutes from "./routes/immich-routes.ts";
import commentsRoutes from "./routes/comment-routes.ts";
import blogRoutes from "./routes/blog-routes.ts";
import contactRoutes from "./routes/contact-routes.ts";
import messagesRoutes from "./routes/messages-routes.ts";
import notificationRoutes from "./routes/notification-routes.ts";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:3001", // your Next.js frontend
    credentials: true,
  })
);

// Routes that deal with immich image creation and retrieval
app.use("/api/immich", immichRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes to create blog post
app.use("/api/blog", blogRoutes);

// Routes for contacting through email
app.use("/api/contact", contactRoutes);

// Routes for users
app.use("/api/users", userRoutes);

// Routes for blog comments and replies
app.use("/api/comments", commentsRoutes);

// Messages routes
app.use("/api/messages", messagesRoutes);

// Notification routes
app.use("/api/notifications", notificationRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; // If you are importing this app into another file (e.g., for testing)

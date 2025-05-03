import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload"; // Install this to handle file uploads
import immichRoutes from "./routes/immich-routes.ts";
import createBlogPost from "./routes/blog-posts.ts";
import userRoutes from "./routes/user-routes.ts";

// Initialize environment variables
dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(fileUpload()); // This middleware handles file uploads

// Routes
app.use("/api/", immichRoutes); // Mount the image routes

// Route to create blog post
app.use("/api/blog", createBlogPost);

// Routes for users
app.use("/api/users", userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// import express from "express";
// import dotenv from "dotenv";
// import fileUpload from "express-fileupload"; // Install this to handle file uploads
// import immichRoutes from "./routes/immich-routes.ts";
// import createBlogPost from "./routes/blog-posts.ts";
// import userRoutes from "./routes/user-routes.ts";

// // Initialize environment variables
// dotenv.config();

// const app = express();
// const port = 3000;
// const router = express.Router();

// // Middleware
// app.use(express.json());
// app.use(fileUpload()); // This middleware handles file uploads

// // Routes
// app.use("/api", immichRoutes); // Mount the image routes

// // Route to create blog post
// app.use("/api/blog", createBlogPost);

// // Routes for users
// app.use("/api/users", userRoutes);

// // Start server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user-routes.ts";
import {
  getImmichImage,
  getImmichThumbnail,
  postNewImage,
} from "./controllers/immichController.ts";
import blogRoutes from "./routes/blog-routes.ts";
// import postNewImage from "./controllers/immichController.ts";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: "uploads/" });

app.use(
  cors({
    origin: "http://localhost:3001", // your Next.js frontend
    credentials: true,
  })
);

// --- Route Definition: Correctly type `req` for the Multer middleware chain ---
// The `req` object passed to Multer's middleware and then to your controller
// will have the `file` property. So, we should type it as `CustomRequest` here.
app.post(
  "/api/upload",

  upload.array("images"), // Multer middleware processes the file
  postNewImage
);
app.get("/api/images", getImmichImage);
app.get("/api/thumbnail", getImmichThumbnail);
// IMPORTANT: Place general body parsers *before* your routes,
// but be aware they will *not* parse multipart/form-data.
// Multer handles multipart/form-data exclusively.
// If you only have file uploads, you might not even need these.
// If you have other API endpoints expecting JSON, keep these.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to create blog post
app.use("/api/blog", blogRoutes);

// Routes for users
app.use("/api/users", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; // If you are importing this app into another file (e.g., for testing)

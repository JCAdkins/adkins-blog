import express from "express";
import postNewImageService from "../services/immichService.ts";

// Get all featured blog posts
export default async function postNewImage(
  req: express.Request,
  res: express.Response
) {
  try {
    console.log("reached in here.");
    const { filePath } = req.body;

    if (!filePath || typeof filePath !== "string") {
      return res.status(400).json({ message: "Missing or invalid filePath" });
    }
    const result = await postNewImageService(filePath);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// src/controllers/immichController.ts
import express from "express"; // Ensure Request, Response are imported
import fs from "fs"; // Use fs/promises for async/await file operations
import {
  postNewImageService,
  getImmichImageService,
  getImmichThumbnailService,
} from "../services/immichService.js";
// You might need to declare the Multer types globally or import them if not already done
// For simplicity, let's redefine CustomRequest or ensure it's imported from a shared type file
interface CustomRequest extends express.Request {
  file?: Express.Multer.File;
}

export async function postNewImage(
  req: CustomRequest, // IMPORTANT: Use CustomRequest here
  res: express.Response
) {
  try {
    console.log("Creating new image.");
    const uploadedFiles = req.files; // This is where the file data will be

    if (!uploadedFiles || !Array.isArray(uploadedFiles)) {
      console.error("No file found on req.file");
      res.status(400).json({ message: "No file provided for upload." });
      return;
    }

    const urls = await Promise.all(
      uploadedFiles.map(async (file: any) => {
        const filePathOnServer = file.path;
        const binaryData = fs.createReadStream(filePathOnServer);
        return await postNewImageService(binaryData, file);
      })
    );

    res.status(200).json(urls);
  } catch (error) {
    console.error("Error in immichController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getImmichImage(
  req: express.Request,
  res: express.Response
) {
  const immichId = req.query.id as string;
  console.log("downloading immich image at controller...");
  try {
    const result = await getImmichImageService(immichId);

    if (result) {
      // If the result is the binary data, send it as a response
      res.setHeader("Content-Type", "application/octet-stream");
      res.send(result); // Send the binary data
    } else {
      // If no data is found, send an error response
      res.status(404).json({ error: "Image not found" });
    }
  } catch (error) {
    console.error("Error in getImmichImage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getImmichThumbnail(
  req: express.Request,
  res: express.Response
) {
  const immichId = req.query.id as string;

  try {
    const result = await getImmichThumbnailService(immichId);

    if (result) {
      // If the result is the binary data, send it as a response
      res.setHeader("Content-Type", "application/octet-stream");
      res.send(result); // Send the binary data
    } else {
      // If no data is found, send an error response
      res.status(404).json({ error: "Image not found" });
    }
  } catch (error) {
    console.error("Error in getImmichImage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

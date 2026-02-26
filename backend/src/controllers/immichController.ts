// src/controllers/immichController.ts
import {
  downloadImmichImage,
  downloadImmichImageThumbnail,
  PostNewImmichImage,
} from "../services/immichService.js";
import express from "express"; // Ensure Request, Response are imported
import fs from "fs"; // Use fs/promises for async/await file operations
// You might need to declare the Multer types globally or import them if not already done
// For simplicity, let's redefine CustomRequest or ensure it's imported from a shared type file
interface CustomRequest extends express.Request {
  file?: Express.Multer.File;
}

export async function postNewImage(req: CustomRequest, res: express.Response) {
  try {
    console.log("Creating new image.");
    const uploadedFiles = req.files;

    if (!uploadedFiles || !Array.isArray(uploadedFiles)) {
      console.error("No file found on req.file");
      res.status(400).json({ message: "No file provided for upload." });
      return;
    }

    const urls = await Promise.all(
      uploadedFiles.map(async (file: any) => {
        const filePathOnServer = file.path;
        const binaryData = fs.createReadStream(filePathOnServer);
        const result = await PostNewImmichImage(binaryData, file);

        // Clean up after successful upload
        fs.unlinkSync(filePathOnServer);

        return result;
      }),
    );

    res.status(200).json(urls);
  } catch (error) {
    // Clean up any remaining temp files if something went wrong
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: any) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    console.error("Error in immichController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getImmichImage(
  req: express.Request,
  res: express.Response,
) {
  const immichId = req.query.id as string;
  console.log(`downloading immich image id:${immichId} at controller...`);
  try {
    const result = await downloadImmichImage(immichId);
    console.log("immich image: ", result);
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
  res: express.Response,
) {
  const immichId = req.query.id as string;

  try {
    console.log(`downloading immich thumbnail with id: ${immichId}`);
    const result = await downloadImmichImageThumbnail(immichId);
    console.log("thumbnail: ", result);

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

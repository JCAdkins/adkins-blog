// src/controllers/immichController.ts
import express from "express"; // Ensure Request, Response are imported
import fs from "fs"; // Use fs/promises for async/await file operations
import path from "path"; // Might be useful for joining paths or getting extensions
import postNewImageService from "../services/immichService.ts";
// You might need to declare the Multer types globally or import them if not already done
// For simplicity, let's redefine CustomRequest or ensure it's imported from a shared type file
interface CustomRequest extends express.Request {
  file?: Express.Multer.File;
}

export default async function postNewImage(
  req: CustomRequest, // IMPORTANT: Use CustomRequest here
  res: express.Response
) {
  try {
    console.log("reached in immichController.");
    const uploadedFiles = req.files; // This is where the file data will be

    if (!uploadedFiles) {
      console.error("No file found on req.file");
      return res.status(400).json({ message: "No file provided for upload." });
    }

    const urls: any[] = [];
    uploadedFiles.forEach(async (file: any) => {
      // This is the path where Multer saved the file on your server's disk
      const filePathOnServer = file.path;
      let binaryData;
      try {
        binaryData = fs.createReadStream(filePathOnServer);
      } catch (readError) {
        console.error(`Error reading file from disk: ${readError}`);
        return res
          .status(500)
          .json({ message: "Failed to read uploaded file from server." });
      }
      console.log(file);
      postNewImageService(binaryData, file);
    });

    // const result = async uploadedFiles.map(file => await postNewImageService(file) )

    res.status(200).json(urls);
  } catch (error) {
    console.error("Error in immichController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

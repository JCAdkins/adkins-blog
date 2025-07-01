import express from "express";
import {
  getImmichImage,
  getImmichThumbnail,
  postNewImage,
} from "../controllers/immichController.ts";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",

  upload.array("images"), // Multer middleware processes the file
  postNewImage
);
router.get("/images", getImmichImage);
router.get("/thumbnail", getImmichThumbnail);

export default router;

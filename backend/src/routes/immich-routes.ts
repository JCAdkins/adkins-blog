import express from "express";
import {
  getImmichImage,
  getImmichThumbnail,
  postNewImage,
} from "../controllers/immichController.js";
import multer from "multer";
import { verifyToken } from "../middleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  verifyToken,
  upload.array("images"), // Multer middleware processes the file
  postNewImage
);
router.get("/images", getImmichImage);
router.get("/thumbnail", getImmichThumbnail);

export default router;

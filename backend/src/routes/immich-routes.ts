import express from "express";
import postNewImage from "../controllers/immichController.ts";

const router = express.Router();

router.post("/upload", postNewImage);

export default router;

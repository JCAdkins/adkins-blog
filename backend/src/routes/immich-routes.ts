import express from "express";
import postNewImage from "../controllers/immichController.ts";

const router = express.Router();

router.post("/upload", (req, res) => postNewImage(req, res));

export default router;

import { verifyToken } from "../middleware.ts";
import {
  contactAdmin,
  welcomeNewUser,
} from "../controllers/contactController.ts";
import express from "express";

const router = express.Router();

router.post("/", verifyToken, contactAdmin);

router.post("/greeting", welcomeNewUser);

export default router;

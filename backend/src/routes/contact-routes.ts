import { verifyToken } from "../middleware.js";
import {
  contactAdmin,
  welcomeNewUser,
} from "../controllers/contactController.js";
import express from "express";

const router = express.Router();

router.post("/", verifyToken, contactAdmin);

router.post("/greeting", verifyToken, welcomeNewUser);

export default router;

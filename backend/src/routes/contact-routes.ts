import {
  contactAdmin,
  welcomeNewUser,
} from "../controllers/contactController.ts";
import express from "express";

const router = express.Router();

router.post("/", contactAdmin);

router.post("/greeting", welcomeNewUser);

export default router;

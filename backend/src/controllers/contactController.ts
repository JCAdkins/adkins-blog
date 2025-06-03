import {
  contactAdminEmail,
  welcomeNewUserEmail,
} from "../services/contactService.ts";
import express from "express";

// Get all featured blog posts
export async function contactAdmin(
  _req: express.Request,
  res: express.Response
) {
  try {
    const result = await contactAdminEmail({
      to: "to",
      subject: "subject",
      html: "<div>html</div>",
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error contacting admin:", error);
    res.status(500).json({ result: "failed" });
  }
}

export async function welcomeNewUser(
  req: express.Request,
  res: express.Response
) {
  const { email, username } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const result = await welcomeNewUserEmail(email, username);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    res.status(500).json({ result: "failed" });
  }
}

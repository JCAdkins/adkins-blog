import { saveContactMessageToDb } from "../models/contactModel.ts";
import {
  contactAdminEmail,
  getAdminsList,
  welcomeNewUserEmail,
} from "../services/contactService.ts";
import express from "express";

// Get all featured blog posts
export async function contactAdmin(
  req: express.Request,
  res: express.Response
) {
  const admins = await getAdminsList();

  if (admins.length === 0) {
    console.warn("No admins found to notify.");
    return;
  }
  try {
    const { subject, message, name, email, userId } = req.body;
    const emailResult = await contactAdminEmail({
      to: admins,
      subject,
      html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
    <h2>New Contact Form Submission</h2>
    <p><strong>Sender:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <div style="margin-top: 10px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #ffd3c4;">
      ${message.replace(/\n/g, "<br/>")}
    </div>
    <hr style="margin: 20px 0;" />
    <p style="font-size: 12px; color: #888;">
      Please do not reply to this email. If you need to respond, contact the user directly at ${email}.
    </p>
  </div>
`,
    });
    const reqData = {
      name: name,
      email: email,
      userId: userId,
      subject: subject,
      message: message,
    };
    const dbResult = await saveContactMessageToDb(reqData);
    res.status(200).json({
      emailResult: emailResult,
      db_result: dbResult,
    });
  } catch (error) {
    console.error("Error contacting admin:", error);
    res.status(500).json({ result: "failed" });
  }
}

export async function welcomeNewUser(
  req: express.Request,
  res: express.Response
) {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      res.status(400).json({ error: "Email and Username are required" });
      return;
    }

    const result = await welcomeNewUserEmail(email, username);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    res.status(500).json({ result: "failed" });
  }
}

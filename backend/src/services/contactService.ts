import { getAdminListFromDb } from "../models/contactModel.ts";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailParams = {
  to: string[];
  subject: string;
  html: string;
};

export async function contactAdminEmail({ to, subject, html }: EmailParams) {
  try {
    const data = await resend.emails.send({
      from: "Your App <onboarding@resend.dev>", // default sender for dev
      to,
      subject,
      html,
    });

    console.log("Email sent:", data);
    return data;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}

export async function welcomeNewUserEmail(to: string, username: string) {
  try {
    const data = await resend.emails.send({
      from: "The Blogging Photographer <onboarding@resend.dev>", // default sender for dev
      to,
      subject: "Welcome to Adkins Ninja Blog",
      html: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Adkins Ninja Blog</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
  <h2>Welcome to the Adkins Ninja Blog!</h2>
  <p>Hi ${username},</p>
  <p>Thank you for joining the Adkins Ninja Blog community! 🎉</p>
  <p>We're excited to have you here. Our blog is full of interesting posts, insightful articles, and thought-provoking discussions. Take a moment to explore the latest content, and if something resonates with you, feel free to leave a comment and join the conversation!</p>

  <h3>A Few Tips to Get Started:</h3>
  <ul>
    <li><strong>Browse Posts:</strong> Check out our latest blog posts and find articles that catch your interest.</li>
    <li><strong>Engage:</strong> Don’t hesitate to drop a comment or share your thoughts on any blog post you enjoy.</li>
    <li><strong>Stay Updated:</strong> Be sure to check back for new content regularly, and we also have a newsletter to keep you informed!</li>
  </ul>

  <p><strong>Please Note:</strong><br>
  This is an automated email from our system. For any questions, comments, or issues, please do <strong>not reply</strong> to this email. Instead, please visit our <a href="[Contact Page URL]">Contact Page</a> or reach out to our support team.</p>

  <p>We’re happy to have you as part of the community, and we look forward to seeing your contributions!</p>

  <p>Best regards,<br>
  The Adkins Ninja Blog Team</p>

  <p><strong>P.S.</strong> Don’t forget to follow us on <a href="[Social Media Links]">Social Media</a> for the latest updates!</p>
</body>
</html>

  `,
    });

    console.log("Email sent:", data);
    return data;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}

export async function getAdminsList() {
  const adminList = await getAdminListFromDb();
  console.log("adminList: ", adminList);
  return adminList;
}

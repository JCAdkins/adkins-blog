import { db } from "../lib/prisma.js";
import { ContactInput, EmailParams } from "../models/contactModel.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function contactAdminEmail({ to, subject, html }: EmailParams) {
  try {
    const data = await resend.emails.send({
      from: "Adkins Ninja Blog <noreply@blog.adkins.ninja>",
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

export async function verificationEmail(
  to: string,
  username: string,
  verifyUrl: string,
) {
  try {
    const data = await resend.emails.send({
      from: "The Blogging Photographer <noreply@blog.adkins.ninja>",
      to,
      subject: "Please verify your email — Adkins Ninja Blog",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px;">

    <h2 style="color: #92400e;">Welcome, ${username}! One small step to go 🎉</h2>

    <p>We're so excited to have you join the Adkins Ninja Blog community! Before you dive in, we just need to confirm that this email address belongs to you.</p>

    <p>Click the button below to verify your email and activate your account:</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${verifyUrl}"
        style="background-color: #92400e; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 1rem;">
        Verify My Email
      </a>
    </div>

    <p>If the button above doesn't work, copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #92400e;">${verifyUrl}</p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

    <p style="color: #b45309;">
      ⏳ <strong>Heads up:</strong> This verification link expires in <strong>48 hours</strong>.
      If your account isn't verified within that time, it will be removed from our system and
      you'll need to sign up again. We do this to keep our community safe and spam-free.
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

    <p style="font-size: 0.85rem; color: #6b7280;">
      If you didn't create an account, you can safely ignore this email — nothing will happen.
      If you need help, visit our <a href="https://blog.adkins.ninja/contact" style="color: #92400e;">Contact Page</a>.
    </p>

    <p>We can't wait to see you around!<br>
    <strong>The Adkins Ninja Blog Team</strong></p>
  </div>
</body>
</html>
      `,
    });

    console.log("Verification email sent:", data);
    return data;
  } catch (error) {
    console.error("Verification email failed:", error);
    throw error;
  }
}

export async function welcomeNewUserEmail(to: string, username: string) {
  try {
    const data = await resend.emails.send({
      from: "The Blogging Photographer <noreply@blog.adkins.ninja>",
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
    <li><strong>Engage:</strong> Don't hesitate to drop a comment or share your thoughts on any blog post you enjoy.</li>
    <li><strong>Stay Updated:</strong> Be sure to check back for new content regularly, and we also have a newsletter to keep you informed!</li>
  </ul>

  <p><strong>Please Note:</strong><br>
  This is an automated email from our system. For any questions, comments, or issues, please do <strong>not reply</strong> to this email. Instead, please visit our <a href="https://blog.adkins.ninja/contact">Contact Page</a> or reach out to our support team.</p>

  <p>We're happy to have you as part of the community, and we look forward to seeing your contributions!</p>

  <p>Best regards,<br>
  The Adkins Ninja Blog Team</p>

  <!-- <p><strong>P.S.</strong> Don't forget to follow us on <a href="[Social Media Links]">Social Media</a> for the latest updates!</p> -->
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

export async function passwordResetEmail(to: string, resetUrl: string) {
  try {
    const data = await resend.emails.send({
      from: "Adkins Ninja Blog <noreply@blog.adkins.ninja>",
      to,
      subject: "Reset Your Password",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #92400e;">Password Reset Request</h2>
    <p>Hi there,</p>
    <p>We received a request to reset the password for your Adkins Ninja Blog account. Click the button below to choose a new password:</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}"
        style="background-color: #92400e; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Reset Password
      </a>
    </div>

    <p>This link will expire in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email — your password will not be changed.</p>

    <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
    <p style="word-break: break-all; color: #92400e;">${resetUrl}</p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

    <p style="font-size: 0.85rem; color: #6b7280;">
      This is an automated email. Please do not reply. If you need help, visit our
      <a href="https://blog.adkins.ninja/contact" style="color: #92400e;">Contact Page</a>.
    </p>

    <p>Best regards,<br>The Adkins Ninja Blog Team</p>
  </div>
</body>
</html>
      `,
    });

    console.log("Password reset email sent:", data);
    return data;
  } catch (error) {
    console.error("Password reset email failed:", error);
    throw error;
  }
}

export async function getAdminsList() {
  try {
    const admins = await db.user.findMany({
      where: {
        role: "admin",
      },
      select: {
        email: true,
      },
    });

    return admins.map((admin: any) => admin.email);
  } catch (error) {
    console.error("Error fetching admin list:", error);
    return [];
  }
}

export const saveContactMessageToDb = async (data: ContactInput) => {
  try {
    const newMessage = await db.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        userId: data.userId ?? null,
      },
    });

    return { newMessage };
  } catch (error) {
    console.error("Error saving contact message:", error);
    throw error;
  }
};

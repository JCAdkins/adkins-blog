import { User } from "next-auth";

interface FormWithUser {
  message: string;
  reason: string;
  user: User;
}

interface FormWithoutUser {
  name: string;
  email: string;
  subject: string;
  message: string;
  userId?: string;
}

export async function ContactAdmins(payload: FormWithUser | FormWithoutUser) {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      return "failed";
    }

    return response.status === 200 ? "success" : "failed";
  } catch (error) {
    console.error("Form submission error:", error);
    alert("Something went wrong.");
  }
  return "success";
}

export async function welcomeNewUser({
  email,
  username,
}: {
  email: string;
  username: string;
}) {
  // Have to use these until the app is up and running on our actual domain.
  const testEmail = "jordan.adkins111@gmail.com";
  const testUsername = "JCAdkins24";
  try {
    const response = await fetch("api/contact/greeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, username: testUsername }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.log("response: ", errorText);
      return { status: "failed" };
    }
    return { status: "success" };
  } catch (err) {
    console.error("Greeting failed: ", err);
    alert("Something went wrong.");
  }
  return { status: "success" };
}

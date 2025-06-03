import { User } from "next-auth";

interface FormWithUser {
  message: string;
  reason: string;
  user: User;
}

interface FormWithoutUser {
  name: string;
  email: string;
  reason: string;
  message: string;
}

export async function ContactAdmins(payload: FormWithUser | FormWithoutUser) {
  try {
    const response = await fetch(`${process.env.BASE_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.log("response: ", response.text);
      return { status: "failed" };
    }
    return { status: "success" };
  } catch (error) {
    console.error("Form submission error:", error);
    alert("Something went wrong.");
  }
  return { status: "success" };
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
  console.log("Email: ", email);
  console.log("username: ", username);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/contact/greeting`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail, username: testUsername }),
      },
    );
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

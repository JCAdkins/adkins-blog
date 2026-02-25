import axios from "axios";
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
    const tokenRes = await axios.get("/api/auth/token");
    const { token } = tokenRes.data;
    const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/contact`;
    const response = await axios.post(URL, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.status >= 200 && response.status < 300
      ? "success"
      : "failed";
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
  const testUsername = username || "New User";
  try {
    const tokenRes = await axios.get("/api/auth/token");
    const { token } = tokenRes.data;
    const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/contact/greeting`;
    const response = await axios.post(
      URL,
      {
        email: testEmail,
        username: testUsername,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.status >= 200 && response.status < 300
      ? "success"
      : "failed";
  } catch (err) {
    console.error("Greeting failed: ", err);
    alert("Something went wrong.");
  }
  return { status: "success" };
}

export const getUnreadMessagesCount = async () => {
  try {
    const tokenRes = await axios.get("/api/auth/token");
    const { token } = tokenRes.data;
    const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/messages/unread/count`;
    const res = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Greeting failed: ", err);
    alert("Something went wrong.");
  }
};

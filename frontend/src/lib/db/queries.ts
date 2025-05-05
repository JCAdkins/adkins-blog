// lib/db/queries.ts

type User = {
  role: string;
  password: string;
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
};

export async function createUser(userData: {
  email: string;
  username: string;
  password: string;
  role: string;
  name?: string;
}): Promise<User> {
  console.log(
    `${process.env.BASE_URL || ""}/users/register`,
    JSON.stringify(userData),
  );
  try {
    const res = await fetch(`${process.env.BASE_URL || ""}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Fetch failed:", errText);
      throw new Error("Failed to create user");
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
  // if (!res.ok) {
  //   throw new Error("Failed to create user");
  // }

  // return await res.json();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const res = await fetch(
    `${process.env.BASE_URL || ""}/users/email/${encodeURIComponent(email)}`,
  );
  if (!res.ok) return null;
  return await res.json();
}

export async function getUserByUsername(
  username: string,
): Promise<User | null> {
  const res = await fetch(
    `${process.env.BASE_URL || ""}/users/username/${encodeURIComponent(username)}`,
  );
  if (!res.ok) return null;
  return await res.json();
}

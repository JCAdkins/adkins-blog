// lib/db/queries.ts

type User = {
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
  name?: string;
}): Promise<User> {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error("Failed to create user");
  }

  return await res.json();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const res = await fetch(`/api/users/email/${encodeURIComponent(email)}`);
  if (!res.ok) return null;
  return await res.json();
}

export async function getUserByUsername(
  username: string,
): Promise<User | null> {
  const res = await fetch(
    `/api/users/username/${encodeURIComponent(username)}`,
  );
  if (!res.ok) return null;
  return await res.json();
}

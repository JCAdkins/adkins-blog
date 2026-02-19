export interface NewUserInput {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  role: "user" | "admin"; // optional if you default to "user"
}

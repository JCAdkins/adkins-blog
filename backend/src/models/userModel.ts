export interface NewUserInput {
  email: string;
  password: string;
  username: string;
  first_name?: string;
  last_name?: string;
  role: "user" | "admin"; // optional if you default to "user"
}

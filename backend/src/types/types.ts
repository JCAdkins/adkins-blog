export interface ImmichImage {
  id: string; // e.g. '04f57ec0-da1d-4ade-b82c-00b040680f87'
  status: string; // e.g. 'created'
}

export interface BlogPostInput {
  title: string;
  description: string;
  content: string;
  featured: string;
  images?: ImmichImage[]; // Relation
}

export interface NewUserInput {
  email: string;
  password: string;
  username: string;
  first_name?: string;
  last_name?: string;
  role: "user" | "admin"; // optional if you default to "user"
}

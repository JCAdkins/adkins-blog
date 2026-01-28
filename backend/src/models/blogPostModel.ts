import { ImmichImage } from "./immichImageModel.js";

export interface BlogPostInput {
  title: string;
  description: string;
  genre: BlogGenre;
  content: string;
  featured: string;
  images?: ImmichImage[]; // Relation
}

export const genreOptions = [
  "educational",
  "excursion",
  "review",
  "comparison",
  "tutorial",
  "news",
] as const;

export type BlogGenre = (typeof genreOptions)[number];

import { Key } from "react";
import { BlogGenre } from "./blogGenreModel";
import { BlogPostImage } from "./blogPostImageModel";

export type Blog = {
  genre: BlogGenre;
  id: Key | null | undefined;
  title: string;
  description: string;
  content: string;
  featured: boolean;
  blogPostImages?: BlogPostImage[];
  createdAt: string;
  updatedAt: string;
};

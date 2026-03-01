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
  immichAlbumId?: String;
  immichShareToken?: String;
  blogPostImages?: BlogPostImage[];
  createdAt: string;
  updatedAt: string;
};

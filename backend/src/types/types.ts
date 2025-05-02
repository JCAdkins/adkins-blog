interface ImageInput {
  url: string;
}

export interface BlogPostInput {
  title: string;
  description: string;
  content: string;
  featured: boolean;
  images?: ImageInput[];
}

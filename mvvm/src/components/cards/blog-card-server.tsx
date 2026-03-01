// src/components/cards/BlogCardServer.tsx
import { Blog } from "@/models/blog/blogModel";

type BlogCardPropsBase = {
  blog: Blog;
  imageUrl?: string;
  className?: string;
  childProps?: {};
};

type BlogCardServerProps<T extends BlogCardPropsBase> = {
  blog: Blog;
  CardComponent: React.ComponentType<T>;
  className?: string;
  extraProps?: Omit<T, keyof BlogCardPropsBase>; // any other props to forward
};

export default async function BlogCardServer<T extends BlogCardPropsBase>({
  blog,
  CardComponent,
  className,
  extraProps,
}: BlogCardServerProps<T>) {
  const imageUrl = `https://immich.adkins.ninja/api/assets/${blog.blogPostImages?.[0]?.imageId}/thumbnail?key=${blog.immichShareToken}`;

  // Combine required props + any extras
  const props = {
    blog,
    imageUrl,
    ...(extraProps || {}),
    className,
  } as T;

  return <CardComponent {...props} />;
}

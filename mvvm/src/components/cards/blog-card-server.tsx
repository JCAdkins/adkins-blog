// src/components/cards/BlogCardServer.tsx
import { Blog } from "@/models/blog/blogModel";
import { getImmichAsset } from "../../lib/services/immich-service";

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
  const imageUrl = await getImmichAsset({
    type: "thumbnail",
    id: blog.blogPostImages?.[0]?.imageId,
  });

  // Combine required props + any extras
  const props = {
    blog,
    imageUrl,
    ...(extraProps || {}),
    className,
  } as T;

  return <CardComponent {...props} />;
}

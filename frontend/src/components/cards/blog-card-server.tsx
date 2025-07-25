// src/components/cards/BlogCardServer.tsx
import { getImmichAsset } from "../../lib/services/immich-service";
import { Blog } from "next-auth";

type BlogCardPropsBase = {
  blog: Blog;
  imageUrl?: string;
  className?: string;
  childProps?: {};
};

type BlogCardServerProps<T extends BlogCardPropsBase> = {
  blog: Blog;
  CardComponent: React.ComponentType<T>;
  extraProps?: Omit<T, keyof BlogCardPropsBase>; // any other props to forward
};

export default async function BlogCardServer<T extends BlogCardPropsBase>({
  blog,
  CardComponent,
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
  } as T;

  return <CardComponent {...props} />;
}

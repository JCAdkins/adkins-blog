// src/components/cards/BlogCardServer.tsx
import { getImmichImage } from "../../lib/db/queries";
import { Blog } from "next-auth";

type BlogCardPropsBase = {
  blog: Blog;
  imageUrl: string | undefined;
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
  const imageUrl = await getImmichImage(blog.blogPostImages?.[0]?.image.id);

  // Combine required props + any extras
  const props = {
    blog,
    imageUrl,
    ...(extraProps || {}),
  } as T;

  return <CardComponent {...props} />;
}

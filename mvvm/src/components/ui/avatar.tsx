"use client";

import * as Avatar from "@radix-ui/react-avatar";
import Image from "next/image";

type UserAvatarProps = {
  src?: string | null;
  alt?: string;
  fallbackSrc?: string;
  className?: string;
};

export default function UserAvatar({
  src,
  alt = "User avatar",
  fallbackSrc = "/generic-prof-pic.webp",
  className = "h-10 w-10",
}: UserAvatarProps) {
  return (
    <Avatar.Root
      className={`relative inline-block overflow-hidden rounded-full bg-gray-100 ${className}`}
    >
      <Avatar.Image
        src={src || ""}
        alt={alt}
        className="h-full w-full object-cover"
      />
      <Avatar.Fallback className="absolute inset-0">
        <Image
          src={fallbackSrc}
          alt="Fallback"
          className="h-full w-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Avatar.Fallback>
    </Avatar.Root>
  );
}

"use client";
import { usePathname } from "next/navigation";
import CreatePostButton from "../buttons/create-post-button";

export default function AdminHeader() {
  const showCreateButton = usePathname() === "/admin/posts";
  return (
    <header className="relative flex items-center justify-between bg-white px-6 py-4 shadow">
      <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold">
        Admin
      </h1>
      {showCreateButton && <CreatePostButton />}
    </header>
  );
}

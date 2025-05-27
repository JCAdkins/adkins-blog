"use client";
import { usePathname } from "next/navigation";
import CreatePostButton from "../buttons/create-post-button";

export default function AdminHeader() {
  const showCreateButton = usePathname() === "/admin/posts";

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
      <h1 className="w-full text-center text-xl font-bold">Admin</h1>

      {showCreateButton && <CreatePostButton />}
    </header>
  );
}

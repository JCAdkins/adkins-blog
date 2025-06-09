"use client";
import { usePathname } from "next/navigation";
import CreatePostButton from "../buttons/create-post-button";
import { Menu } from "lucide-react";

type AdminHeaderProps = {
  onMenuClick?: () => void;
};

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const showCreateButton = usePathname() === "/admin/posts";

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
      <button
        onClick={onMenuClick}
        className="bg-login/90 hover:bg-login-hover/90 hover:shadow-header rounded p-2 text-white md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>{" "}
      <h1 className="w-full text-center text-xl font-bold">Admin</h1>
      {showCreateButton && <CreatePostButton />}
    </header>
  );
}

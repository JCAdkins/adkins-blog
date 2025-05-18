"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";

export function UserMenu({ user }: { user: User }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="bg-login hover:bg-login-hover cursor-pointer rounded-full px-3 py-1 text-sm font-medium">
          {user.username}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => console.log("Settings clicked")}>
          Settings
        </DropdownMenuItem>

        {user.role === "admin" ? (
          <DropdownMenuItem onClick={() => router.push("/admin")}>
            Admin
          </DropdownMenuItem>
        ) : (
          <></>
        )}
        <DropdownMenuItem
          onClick={() => {
            console.log("Logging out");
            signOut();
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

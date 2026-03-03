"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import UserAvatar from "../ui/avatar";
import { useAvatarSrc } from "@/view-models/useAvatarSrc";

export function UserMenu({ user }: { user: User }) {
  const router = useRouter();
  const avatarSrc = useAvatarSrc(user.image);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className=" cursor-pointer rounded-full text-sm font-medium">
          <UserAvatar
            src={avatarSrc}
            fallbackSrc="/generic-prof-pic.webp"
            alt={user.username[0].toUpperCase()}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark:bg-dark-card dark:border-dark-muted dark:text-dark-muted">
        <DropdownMenuItem
          onClick={() => router.push("/settings")}
          className="dark:hover:bg-dark-border dark:focus:bg-dark-border"
        >
          Settings
        </DropdownMenuItem>

        {user.role === "admin" ? (
          <DropdownMenuItem
            onClick={() => router.push("/admin")}
            className="dark:hover:bg-dark-border dark:focus:bg-dark-border"
          >
            Admin
          </DropdownMenuItem>
        ) : (
          <></>
        )}
        <DropdownMenuItem
          onClick={async () => {
            console.log("Logging out");
            await signOut();
          }}
          className="dark:hover:bg-dark-border dark:focus:bg-dark-border"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

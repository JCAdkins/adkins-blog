"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import UserAvatar from "../ui/avatar";
import Image from "next/image";
import { NotificationBadge } from "../badges/notification-badge";

export function UserMenu({ user }: { user: User }) {
  const router = useRouter();
  const { data: _, status, update } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className=" cursor-pointer rounded-full text-sm font-medium">
          {user.image ? (
            <UserAvatar src={user.image} alt={user.username[0].toUpperCase()} />
          ) : (
            <Image
              width={6}
              height={6}
              src="/generic-prof-pic.webp"
              alt="Generic profile"
              className="rounded-full h-8 w-8"
            />
          )}
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
          onClick={async () => {
            console.log("Logging out");
            await signOut();
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

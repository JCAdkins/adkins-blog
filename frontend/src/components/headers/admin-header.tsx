"use client";
import { /*signOut*/ useSession } from "next-auth/react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

export default function AdminHeader() {
  const { data: session } = useSession();
  return (
    <header className="flex items-center justify-center bg-white px-6 py-4 shadow">
      <h1 className="text-xl font-bold">Admin</h1>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full bg-amber-500 px-4 py-2 text-white hover:bg-amber-600">
            {session?.user?.username}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </header>
  );
}

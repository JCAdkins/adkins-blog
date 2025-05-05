import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "../app/(auth)/auth";

export function UserMenu({ username }: { username: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium hover:bg-gray-200">
          {username}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => console.log("Settings clicked")}>
          Settings
        </DropdownMenuItem>
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

"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface MobileHeaderProps {
  links?: { href: string; label: string; icon?: ReactNode }[];
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  className?: string;
}

export default function MobileHeader({
  links = [],
  leftContent,
  rightContent,
  className = "bg-header text-black",
}: MobileHeaderProps) {
  return (
    <header className={`p-4 ${className}`}>
      <nav className="flex w-full items-center justify-between">
        <div>{leftContent}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="left-0 mt-2 w-screen rounded-none border-t dark:border-dark-muted bg-white dark:bg-dark-surface shadow-none"
            side="bottom"
            align="start"
          >
            <div className="flex w-full flex-col">
              {/* Right content inside dropdown */}
              <div className="flex justify-center px-4 py-2">
                {rightContent}
              </div>
              {/* Divider */}
              <div className="my-2 border-b dark:border-b-dark-muted" />
              {links.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link
                    href={link.href}
                    className="flex w-full items-center justify-center gap-2 px-4 py-2 text-base hover:bg-gray-100 dark:text-dark-muted dark:hover:bg-dark-card"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}

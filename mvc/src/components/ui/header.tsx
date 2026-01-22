import Link from "next/link";
import { ReactNode } from "react";

interface HeaderProps {
  links?: { href: string; label: string }[];
  leftContent?: ReactNode; // Allows passing a logo, title, etc.
  rightContent?: ReactNode; // Allows passing a theme switcher, user menu, etc.
  className?: string; // Allows custom styling
}

export default function Header({
  links = [],
  leftContent = (
    <Link href="/" className="text-xl font-bold">
      My Website
    </Link>
  ),
  rightContent,
  className = "bg-gray-900 text-white fixed top-0 z-50",
}: HeaderProps) {
  return (
    <header className={`p-4 ${className}`}>
      <nav className="container mx-auto grid grid-cols-3 items-center">
        <div className="flex items-center">{leftContent}</div>
        <div className="flex justify-center space-x-4 text-xl z-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-r pr-4 first:ml-4 last:border-r-0 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-end">{rightContent}</div>
      </nav>
    </header>
  );
}

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
  className = "bg-gray-900 text-white",
}: HeaderProps) {
  return (
    <header className={`p-4 ${className}`}>
      <nav className="container mx-auto flex items-center justify-between">
        <div>{leftContent}</div>
        <div className="space-x-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </div>
        <div>{rightContent}</div>
      </nav>
    </header>
  );
}

"use client";

import { useSession } from "next-auth/react";
import Header from "../ui/header";
import MobileHeader from "../ui/mobile-header";
import LoginButton from "../buttons/login-button";
import { UserMenu } from "../menus/user-menu";
import localFont from "next/font/local";

const biancha = localFont({
  src: "../../fonts/Resillia.ttf",
});

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

export default function MainHeader() {
  const { data: session, status } = useSession();
  const leftContent = (
    <h1
      className={`text-sm font-bold md:text-lg lg:text-2xl ${biancha.className}`}
    >
      Adkins Ninja Blog
    </h1>
  );

  const rightContent = session?.user ? (
    // <Alert
    <UserMenu user={session.user} />
  ) : (
    <LoginButton />
  );

  return (
    <>
      {/* Desktop Header (≥ sm) */}
      <div className="hidden sm:block">
        <Header
          links={links}
          leftContent={leftContent}
          rightContent={rightContent}
          className="bg-header text-black"
        />
      </div>

      {/* Mobile Header (< sm) */}
      <div className="block sm:hidden">
        <MobileHeader
          links={links}
          leftContent={leftContent}
          rightContent={rightContent}
          className="bg-header text-black"
        />
      </div>
    </>
  );
}

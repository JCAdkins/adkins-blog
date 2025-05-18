"use client";

import Header from "../ui/header";
import LoginButton from "../buttons/login-button";
import { UserMenu } from "../menus/user-menu";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function MainHeader() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  const { data: session } = useSession();

  useEffect(() => {
    console.log("session: ", session);
  }, [session]);

  return (
    <Header
      links={links}
      leftContent={<h1 className="text-xl font-bold">Adkins Ninja Blog</h1>}
      rightContent={
        session?.user ? <UserMenu user={session.user} /> : <LoginButton />
      }
      className="bg-header text-black"
    />
  );
}

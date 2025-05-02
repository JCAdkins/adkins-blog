import Header from "./ui/header";
import LoginButton from "./buttons/login-button";

export default function MainHeader() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <Header
      links={links}
      leftContent={<h1 className="text-xl font-bold">Adkins Ninja Blog</h1>}
      rightContent={<LoginButton />}
      className="bg-header text-black"
    />
  );
}

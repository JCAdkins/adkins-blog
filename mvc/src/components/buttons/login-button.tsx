"use client";

import { useRouter } from "next/navigation";

const LoginButton = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-login hover:bg-login-hover cursor-pointer rounded-full px-3 py-1 text-sm font-medium text-white shadow-md transition duration-100 ease-in-out hover:cursor-pointer"
    >
      Login
    </button>
  );
};

export default LoginButton;

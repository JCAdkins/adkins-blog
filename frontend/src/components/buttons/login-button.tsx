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
      className="bg-login hover:bg-login-hover rounded-xl px-4 py-2 font-semibold text-white shadow-md transition duration-100 ease-in-out hover:cursor-pointer"
    >
      Login
    </button>
  );
};

export default LoginButton;

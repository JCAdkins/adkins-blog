"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      return !prev;
    });
  };

  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        className="peer sr-only"
      />
      <div className="h-5 w-10 rounded-full bg-gray-300 transition-all peer-checked:bg-gray-600">
        <div className="absolute top-1 left-1 h-3.5 w-3.5 rounded-full bg-white transition-all peer-checked:translate-x-5 peer-checked:bg-gray-200"></div>
      </div>
    </label>
  );
}

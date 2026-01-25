"use client";

import { useEffect, useState } from "react";

export function ScrollSwitchBg() {
  const [activeIndex, setActiveIndex] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight <= 0) return;

      const progress = scrollTop / docHeight;

      if (progress < 0.33) setActiveIndex(0);
      else if (progress < 0.66) setActiveIndex(1);
      else setActiveIndex(2);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="hidden sm:block fixed inset-0 -z-10">
      {/* Background 1 */}
      <div
        className={`absolute inset-0 bg-[url('/misty-mountains.jpg')] bg-cover bg-center bg-no-repeat bg-fixed transition-opacity duration-1000 ease-in-out ${
          activeIndex === 0 ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Background 2 */}
      <div
        className={`absolute inset-0 bg-[url('/close-up-pink-flower.jpg')] bg-cover bg-center bg-no-repeat bg-fixed transition-opacity duration-1000 ease-in-out ${
          activeIndex === 1 ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Background 3 */}
      <div
        className={`absolute inset-0 bg-[url('/buildings.jpg')] bg-cover bg-center bg-no-repeat bg-fixed transition-opacity duration-1000 ease-in-out ${
          activeIndex === 2 ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { Switch } from "@radix-ui/react-switch";

const ToggleSwitch = () => {
  const [isDark, setIsDark] = useState(
    typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <form>
      <div className="flex items-center">
        <label
          className="pr-[15px] text-[15px] leading-none text-white"
          htmlFor="dark-mode"
        >
          {isDark ? "Dark Mode" : "Light Mode"}
        </label>
        <Switch.Root
          className="bg-blackA6 shadow-blackA4 relative h-[25px] w-[42px] cursor-default rounded-full shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
          id="dark-mode"
          // style={{ "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)" }}
        >
          <Switch.Thumb className="shadow-blackA4 block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
        </Switch.Root>
      </div>
    </form>
  );
};
export default ToggleSwitch;

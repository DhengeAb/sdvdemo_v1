"use client";
import { TypewriterEffectSmooth } from "./typewriter-effect";
export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "The Droplet Builder ",
      className: "text-blue-500 dark:text-blue-500",
    },

  ];
  return (
    (<div className="flex flex-col items-center justify-center h-[5rem]  ">
      <TypewriterEffectSmooth words={words} />

    </div>)
  );
}

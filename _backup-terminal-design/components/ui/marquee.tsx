// Source: 21st.dev — serafimcloud/marquee (adapted: fixed dark theme, no next-themes)
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  repeat?: number;
  duration?: number;
  fontSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  strokeWidth?: string;
}

const fontSizeClasses = {
  sm: "text-5xl sm:text-6xl md:text-7xl",
  md: "text-6xl sm:text-7xl md:text-8xl",
  lg: "text-7xl sm:text-8xl md:text-9xl",
  xl: "text-8xl sm:text-9xl md:text-[10rem]",
  "2xl": "text-9xl sm:text-[10rem] md:text-[11rem]",
  "3xl": "text-[10rem] sm:text-[11rem] md:text-[12rem]",
};

export const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      className,
      text,
      repeat = 4,
      duration = 20,
      fontSize = "lg",
      strokeWidth = "1px",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("relative w-full overflow-hidden py-16", className)}
        {...props}
      >
        <>
          <div className="absolute bottom-0 left-0 top-0 z-10 w-[20%] bg-gradient-to-r from-bg to-transparent" />
          <div className="absolute bottom-0 right-0 top-0 z-10 w-[20%] bg-gradient-to-l from-bg to-transparent" />
        </>
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            duration,
          }}
        >
          {[...Array(repeat)].map((_, index) => (
            <div key={index} className="mx-4 flex items-center">
              <span
                className={cn(
                  fontSizeClasses[fontSize],
                  "px-4 font-mono font-bold text-transparent"
                )}
                style={{ WebkitTextStroke: `${strokeWidth} rgb(38 50 73)` }}
              >
                {text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    );
  }
);

Marquee.displayName = "Marquee";

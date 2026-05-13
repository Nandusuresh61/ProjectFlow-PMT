import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  className?: string;
}

export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  const variants: Record<string, string> = {
    primary:
      "bg-[#A5D7E8] text-[#0B2447] hover:shadow-[0_0_25px_rgba(165,215,232,0.4)] hover:bg-white",
    secondary:
      "bg-white/5 text-[#A5D7E8] border border-white/10 hover:bg-white/10 backdrop-blur-md",
    outline:
      "bg-transparent text-[#576CBC] border border-[#576CBC]/30 hover:border-[#A5D7E8] hover:bg-[#A5D7E8]/10",
    ghost:
      "bg-transparent text-[#576CBC]/60 hover:bg-white/5 hover:text-white",
    danger:
      "bg-transparent text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`px-5 py-2.5 rounded-2xl font-black transition-all duration-300 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

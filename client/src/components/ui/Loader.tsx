import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   *
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl";

  /**
   *
   * @default "default"
   */
  variant?: "default" | "secondary" | "white" | "ghost" | "black";

  /**
   *
   * @default false
   */
  fullScreen?: boolean;
  text?: string;
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  (
    {
      className,
      size = "md",
      variant = "default",
      fullScreen = false,
      text,
      ...props
    },
    ref,
  ) => {
    // Define size classes
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    };

    const variantClasses = {
      default: "text-green-500",
      secondary: "text-zinc-500",
      white: "text-white",
      ghost: "text-zinc-400/50",
      black: "text-black",
    };

    const containerClasses = cn(
      "flex flex-col items-center justify-center gap-3",
      fullScreen ? "fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm" : "",
      className,
    );

    return (
      <div
        ref={ref}
        className={containerClasses}
        {...props}
        aria-label="Loading"
        role="status"
      >
        <Loader2
          className={cn(
            "animate-spin transition-all duration-300",
            sizeClasses[size],
            variantClasses[variant],
          )}
        />
        {text && (
          <p
            className={cn(
              "text-sm font-medium animate-pulse",
              variant === "white" ? "text-zinc-200" : variant === "black" ? "text-zinc-800" : "text-zinc-400",
            )}
          >
            {text}
          </p>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    );
  },
);

Loader.displayName = "Loader";

export { Loader, type LoaderProps };

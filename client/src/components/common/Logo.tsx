import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps extends React.ComponentProps<"div"> {
    iconClassName?: string;
    textClassName?: string;
    showText?: boolean;
}

export const Logo = ({ className, iconClassName, textClassName, showText = true, ...props }: LogoProps) => {
    return (
        <div className={cn("flex items-center gap-2", className)} {...props}>
            <div className={cn("flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg text-white shadow-sm", iconClassName)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            </div>
            {showText && (
                <span className={cn("font-bold text-xl tracking-tight", textClassName)}>
                    ProjectFlow
                </span>
            )}
        </div>
    );
};

import type { ReactNode } from "react";

export interface BadgeProps {
    children: ReactNode;
    variant?: 'info' | 'success' | 'warning' | 'danger' | 'admin';
}

export const Badge = ({ children, variant = 'info' }: BadgeProps) => {
    const colors: Record<string, string> = {
        info: 'bg-[#19376D]/30 text-[#A5D7E8] border-[#A5D7E8]/20',
        success: 'bg-[#A5D7E8]/10 text-[#A5D7E8] border-[#A5D7E8]/20',
        warning: 'bg-[#576CBC]/20 text-[#A5D7E8] border-[#576CBC]/30',
        danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        admin: 'bg-white/10 text-white border-white/20',
    };
    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${colors[variant]}`}>
            {children}
        </span>
    );
};

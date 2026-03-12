import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    className?: string;
}

export const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
    const variants: Record<string, string> = {
        primary: 'bg-[#A5D7E8] text-[#0B2447] hover:shadow-[0_0_25px_rgba(165,215,232,0.4)] hover:bg-white',
        secondary: 'bg-white/5 text-[#A5D7E8] border border-white/10 hover:bg-white/10 backdrop-blur-md',
        outline: 'bg-transparent text-[#576CBC] border border-[#576CBC]/30 hover:border-[#A5D7E8] hover:bg-[#A5D7E8]/10',
        ghost: 'bg-transparent text-[#576CBC]/60 hover:bg-white/5 hover:text-white',
        danger: 'bg-transparent text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30',
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

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    headerAction?: ReactNode;
    delay?: number;
}

export const Card = ({ children, className = '', title, headerAction, delay = 0 }: CardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -8, borderColor: '#A5D7E833' }}
        className={`bg-[#19376D]/10 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-2xl transition-all duration-500 p-8 ${className}`}
    >
        {(title || headerAction) && (
            <div className="flex justify-between items-center mb-10 px-1">
                {title && <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>}
                {headerAction}
            </div>
        )}
        {children}
    </motion.div>
);

interface BadgeProps {
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

export const BackgroundAtmosphere = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#060c16]">
        <motion.div
            animate={{
                x: [0, 150, 0],
                y: [0, 100, 0],
                scale: [1, 1.4, 1]
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="absolute -top-48 -left-48 w-[50rem] h-[50rem] bg-[#19376D]/20 rounded-full blur-[120px]"
        />
        <motion.div
            animate={{
                x: [0, -100, 0],
                y: [0, 150, 0],
                scale: [1, 1.2, 1]
            }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/3 -right-48 w-[55rem] h-[55rem] bg-[#576CBC]/10 rounded-full blur-[140px]"
        />
        <div className="absolute inset-0 bg-[#0B2447]/20 opacity-80 mix-blend-overlay" />
    </div>
);


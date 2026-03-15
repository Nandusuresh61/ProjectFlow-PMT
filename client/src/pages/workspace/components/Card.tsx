import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface CardProps {
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

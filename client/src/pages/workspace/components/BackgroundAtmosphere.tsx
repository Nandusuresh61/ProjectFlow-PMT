import { motion } from "framer-motion";

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

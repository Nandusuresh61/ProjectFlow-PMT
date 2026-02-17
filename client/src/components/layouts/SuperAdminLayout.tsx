import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { motion, AnimatePresence } from "framer-motion";

export default function SuperAdminLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-black overflow-hidden font-sans text-zinc-100">
            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/10 via-black to-black pointer-events-none" />
                <AdminHeader />

                <main className="flex-1 overflow-y-auto p-6 scroll-smooth z-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

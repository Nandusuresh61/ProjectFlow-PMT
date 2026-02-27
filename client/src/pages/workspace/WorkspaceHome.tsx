import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthUserState } from '@/store/auth.store';
import { logoutUser } from '@/services/auth/auth.api';
import { BackgroundAtmosphere } from './components/BaseComponents';
import { Sidebar, Header, MobileNav } from './components/LayoutComponents';
import { DashboardView } from './views/DashboardView';
import { TeamView } from './views/TeamView';
import { PlaceholderView, InviteModal } from './views/ComplementaryViews';

export default function WorkspaceHome() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const user = AuthUserState((state) => state.user);
    const clearUser = AuthUserState((state) => state.clearUser);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const response = await logoutUser();
            toast.success(response.message || "Logged out successfully");
            setTimeout(() => {
                clearUser();
                navigate('/login');
            }, 800);
        } catch (error: any) {
            toast.error(error.message || "Failed to logout");
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#060c16] font-sans text-white selection:bg-[#A5D7E8] selection:text-[#0B2447] overflow-hidden">
            <BackgroundAtmosphere />

            {/* Desktop sidebar */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <main className="flex-1 flex flex-col min-w-0 relative h-full">
                <Header activeTab={activeTab} user={user} onLogout={handleLogout} />
                {isLoggingOut && <div className="sr-only">Logging out...</div>}

                {/* Content area — add bottom padding on mobile for the nav bar */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-12 pb-20 lg:pb-12 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.02, y: -20 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {activeTab === 'dashboard' ? (
                                    <DashboardView openInvite={() => setIsInviteModalOpen(true)} />
                                ) : activeTab === 'team' ? (
                                    <TeamView openInvite={() => setIsInviteModalOpen(true)} />
                                ) : (
                                    <PlaceholderView activeTab={activeTab} setActiveTab={setActiveTab} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Mobile bottom navigation */}
            <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

            <InviteModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />
        </div>
    );
}

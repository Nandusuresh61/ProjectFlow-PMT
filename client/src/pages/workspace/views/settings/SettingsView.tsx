import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileSettings from '@/pages/profile/Profile';
import { SecuritySettings } from '../security/SecuritySettings';
import { BillingSettings } from '../billing/BillingSettings';
import { SupportTickets } from '../support/SupportTickets';
import { useWorkspaceStore } from '@/store/workspace.store';
import { WorkspaceRoleEnum } from '@/shared/enums/WorkspaceRolesEnum';

export const SettingsView = () => {
    const [activeTab, setActiveTab] = useState('account');

    const role = useWorkspaceStore(state => state.currentWorkspaceRole);
    const isOwner = role === WorkspaceRoleEnum.WORKSPACE_OWNER;
    const isAdmin = role === WorkspaceRoleEnum.WORKSPACE_ADMIN;
    const canAccessTickets = isOwner || isAdmin;

    const tabs = [
        ...(isOwner ? [{ id: 'billing', label: 'Billing' }] : []),
        ...(canAccessTickets ? [{ id: 'tickets', label: 'Tickets' }] : []),
        { id: 'security', label: 'Security' },
        { id: 'account', label: 'Account' },
    ];

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="mb-8 pl-1">
                <h1 className="text-3xl font-black tracking-tight text-white mb-2">Workspace Settings</h1>
                <p className="text-[#576CBC]/60 font-medium">Manage your workspace and account preferences</p>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar border-b border-white/5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-[#A5D7E8] text-[#0B2447] shadow-[0_0_20px_rgba(165,215,232,0.2)]'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="mt-8 bg-[#0B2447]/20 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden min-h-[500px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        {activeTab === 'account' ? (
                            <div className="h-full p-4 lg:p-8">
                                <ProfileSettings />
                            </div>
                        ) : activeTab === 'billing' ? (
                            <div className="h-full">
                                <BillingSettings />
                            </div>
                        ) : activeTab === 'security' ? (
                            <div className="h-full p-4 lg:p-8">
                                <SecuritySettings />
                            </div>
                        ) : activeTab === 'tickets' ? (
                            <div className="h-full">
                                <SupportTickets />
                            </div>
                        ) : null}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

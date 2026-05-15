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

    const tabs = [
        { id: 'general', label: 'General' },
        ...(isOwner ? [{ id: 'billing', label: 'Billing' }] : []),
        { id: 'tickets', label: 'Tickets' },
        { id: 'security', label: 'Security' },
        { id: 'account', label: 'Account' },
        { id: 'danger', label: 'Danger Zone' },
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
                        ) : activeTab === 'general' ? (
                            <div className="p-8">
                                <div className="border border-white/5 bg-white/[0.02] rounded-2xl p-6 lg:p-8 shadow-sm">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 bg-[#A5D7E8]/10 rounded-xl flex items-center justify-center border border-[#A5D7E8]/20">
                                            <span className="text-[#A5D7E8] font-bold text-xl">W</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-white">Workspace Information</h3>
                                            <p className="text-[#576CBC]/60 text-sm mt-1">Update your workspace's basic details</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-bold text-[#576CBC]/80 uppercase tracking-wider">Workspace Name</label>
                                            <input
                                                type="text"
                                                defaultValue="Acme Workspace"
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#A5D7E8]/30 focus:bg-white/[0.08] transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-bold text-[#576CBC]/80 uppercase tracking-wider">Description</label>
                                            <textarea
                                                rows={4}
                                                defaultValue="A modern project management workspace"
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#A5D7E8]/30 focus:bg-white/[0.08] transition-all resize-none"
                                            />
                                        </div>
                                        <div className="flex justify-end pt-6">
                                            <button className="px-6 py-3.5 bg-[#A5D7E8] text-[#0B2447] font-bold text-sm rounded-xl hover:shadow-[0_0_20px_rgba(165,215,232,0.3)] hover:bg-white transition-all">
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'security' ? (
                            <div className="h-full p-4 lg:p-8">
                                <SecuritySettings />
                            </div>
                        ) : activeTab === 'tickets' ? (
                            <div className="h-full">
                                <SupportTickets />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[500px]">
                                <h3 className="text-xl font-bold text-white mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
                                <p className="text-[#576CBC]/60 text-sm">This section is currently under construction.</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

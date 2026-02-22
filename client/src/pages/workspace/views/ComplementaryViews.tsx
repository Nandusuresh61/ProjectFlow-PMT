import { Zap, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PlaceholderView = ({ activeTab, setActiveTab }: any) => (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
        <motion.div
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="w-40 h-40 bg-white/5 rounded-[4rem] border border-white/10 flex items-center justify-center text-[#A5D7E8]"
        >
            <Zap size={60} className="opacity-40" />
        </motion.div>
        <div>
            <h2 className="text-4xl font-black text-white capitalize tracking-tighter mb-4">{activeTab} Encrypted</h2>
            <p className="text-[#576CBC] max-w-md mx-auto font-medium text-lg leading-relaxed opacity-60">This area is currently being reconfigured with the latest command-link protocols.</p>
        </div>
        <button
            onClick={() => setActiveTab('dashboard')}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all"
        >
            Return to Hub
        </button>
    </div>
);

export const InviteModal = ({ isOpen, onClose }: any) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden"
                >
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Invite Team Member</h3>
                                <p className="text-slate-500 text-sm mt-1">Send an invitation to join your organization</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                <input type="email" placeholder="member@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                                <div className="relative">
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all">
                                        <option>Member</option>
                                        <option>Admin</option>
                                        <option>Viewer</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Message (Optional)</label>
                                <textarea
                                    placeholder="Welcome to the team!"
                                    rows={3}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-slate-200">Cancel</button>
                            <button onClick={onClose} className="flex-1 py-3 text-sm font-bold bg-black text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                                Send Invitation
                            </button>
                        </div>
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

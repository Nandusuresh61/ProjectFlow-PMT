import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { completeSprint, type SprintData } from '@/services/sprint/sprint.api';

interface CompleteSprintModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sprint: SprintData;
    incompleteIssuesCount: number;
    completedIssuesCount: number;
    availableSprints: SprintData[];
    onSuccess: () => void;
    workspaceId: string;
}

export const CompleteSprintModal = ({
    open,
    onOpenChange,
    sprint,
    incompleteIssuesCount,
    completedIssuesCount,
    availableSprints,
    onSuccess,
    workspaceId
}: CompleteSprintModalProps) => {
    const [loading, setLoading] = useState(false);
    const [destination, setDestination] = useState<string>('backlog');

    const handleComplete = async () => {
        try {
            setLoading(true);
            const moveToSprintId = destination === 'backlog' ? null : destination;
            const response = await completeSprint(sprint.sprintId, moveToSprintId, workspaceId);
            
            if (response.success) {
                toast.success('Sprint completed successfully');
                onSuccess();
                onOpenChange(false);
            } else {
                toast.error(response.message || 'Failed to complete sprint');
            }
        } catch (error) {
            console.error('Error completing sprint:', error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onOpenChange(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-[#0A192F] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-black text-white tracking-tight">Complete Sprint</h2>
                                <button 
                                    onClick={() => onOpenChange(false)}
                                    className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <p className="text-white/40 text-sm font-medium">
                                {sprint.name} · Finalizing progress
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-emerald-400/5 border border-emerald-400/10 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                                        <CheckCircle2 size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Completed</span>
                                    </div>
                                    <p className="text-2xl font-black text-white">{completedIssuesCount}</p>
                                    <p className="text-[10px] text-white/30 font-bold uppercase mt-1">Issues Finished</p>
                                </div>
                                <div className="bg-amber-400/5 border border-amber-400/10 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 text-amber-400 mb-1">
                                        <AlertCircle size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Incomplete</span>
                                    </div>
                                    <p className="text-2xl font-black text-white">{incompleteIssuesCount}</p>
                                    <p className="text-[10px] text-white/30 font-bold uppercase mt-1">Issues Remaining</p>
                                </div>
                            </div>

                            {incompleteIssuesCount > 0 && (
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">
                                        Move incomplete issues to
                                    </label>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setDestination('backlog')}
                                            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                                destination === 'backlog' 
                                                ? 'bg-[#A5D7E8]/10 border-[#A5D7E8]/30 ring-1 ring-[#A5D7E8]/20' 
                                                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                                            }`}
                                        >
                                            <span className={`text-sm font-bold ${destination === 'backlog' ? 'text-[#A5D7E8]' : 'text-white/60'}`}>
                                                Backlog
                                            </span>
                                            {destination === 'backlog' && <CheckCircle2 size={16} className="text-[#A5D7E8]" />}
                                        </button>

                                        {availableSprints.filter(s => s.status === 'PLANNED').map(otherSprint => (
                                            <button
                                                key={otherSprint.sprintId}
                                                onClick={() => setDestination(otherSprint.sprintId)}
                                                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                                    destination === otherSprint.sprintId 
                                                    ? 'bg-[#A5D7E8]/10 border-[#A5D7E8]/30 ring-1 ring-[#A5D7E8]/20' 
                                                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                                                }`}
                                            >
                                                <span className={`text-sm font-bold ${destination === otherSprint.sprintId ? 'text-[#A5D7E8]' : 'text-white/60'}`}>
                                                    {otherSprint.name}
                                                </span>
                                                {destination === otherSprint.sprintId && <CheckCircle2 size={16} className="text-[#A5D7E8]" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-3">
                            <button
                                onClick={() => onOpenChange(false)}
                                className="flex-1 px-6 py-3 rounded-2xl text-sm font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleComplete}
                                disabled={loading}
                                className="flex-[2] px-6 py-3 rounded-2xl bg-[#A5D7E8] text-[#0B2447] text-sm font-black hover:bg-[#A5D7E8]/90 transition-all shadow-lg shadow-[#A5D7E8]/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    'Complete Sprint'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

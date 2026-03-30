import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, CreditCard, Calendar, FolderKanban, ShieldAlert, ShieldCheck } from "lucide-react";
import type { WorkspaceDetails } from "@/types/superadmin.types";
import { Loader } from "@/components/ui/Loader";

interface WorkspaceDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    workspace: WorkspaceDetails | null;
    loading: boolean;
}

export function WorkspaceDetailsModal({
    isOpen,
    onClose,
    workspace,
    loading,
}: WorkspaceDetailsModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800 text-zinc-100">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-zinc-100">
                        Workspace Details
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader text="Loading details..." />
                    </div>
                ) : workspace ? (
                    <div className="space-y-6">
                        {/* Workspace Info Header */}
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-800/50 border border-zinc-800">
                            <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20 overflow-hidden flex-shrink-0">
                                <Building2 className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-medium text-lg text-zinc-100 truncate">
                                        {workspace.name}
                                    </h3>
                                    <Badge 
                                        variant="outline" 
                                        className={workspace.isSuspended ? "border-red-500/30 text-red-400 bg-red-500/10" : "border-green-500/30 text-green-400 bg-green-500/10"}
                                    >
                                        {workspace.isSuspended ? (
                                            <><ShieldAlert className="h-3 w-3 mr-1" /> Suspended</>
                                        ) : (
                                            <><ShieldCheck className="h-3 w-3 mr-1" /> Active</>
                                        )}
                                    </Badge>
                                </div>
                                <div className="text-sm text-zinc-400 truncate">
                                    Owner: <span className="text-zinc-200">{workspace.ownerName}</span>
                                </div>
                                <div className="text-xs text-zinc-500 truncate">
                                    {workspace.ownerEmail}
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-800/50 space-y-2">
                                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                    <CreditCard className="h-4 w-4 text-green-500/70" />
                                    <span>Plan Type</span>
                                </div>
                                <div className="text-lg font-semibold text-zinc-100">{workspace.planName}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-800/50 space-y-2">
                                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                    <Calendar className="h-4 w-4 text-green-500/70" />
                                    <span>Plan Expiry</span>
                                </div>
                                <div className="text-sm font-medium text-zinc-100">
                                    {workspace.planExpireDate ? new Date(workspace.planExpireDate).toLocaleDateString() : "Lifetime / Free"}
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-800/50 space-y-2">
                                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                    <FolderKanban className="h-4 w-4 text-green-500/70" />
                                    <span>Projects</span>
                                </div>
                                <div className="text-lg font-semibold text-zinc-100">{workspace.projectCount}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-800/50 space-y-2">
                                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                    <Users className="h-4 w-4 text-green-500/70" />
                                    <span>Members</span>
                                </div>
                                <div className="text-lg font-semibold text-zinc-100">{workspace.memberCount}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-red-400">
                        Failed to load workspace details
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

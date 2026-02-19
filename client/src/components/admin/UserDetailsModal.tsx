import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, Crown, Users, CreditCard, Mail, Calendar } from "lucide-react";
import type { UserDetails } from "@/types/superadmin.types";
import { Loader } from "@/components/ui/Loader";

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserDetails | null;
    loading: boolean;
}

export function UserDetailsModal({
    isOpen,
    onClose,
    user,
    loading,
}: UserDetailsModalProps) {
    if (!user && !loading) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800 text-zinc-100">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-zinc-100">
                        User Details
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader text="Loading details..." />
                    </div>
                ) : user ? (
                    <div className="space-y-6">
                        {/* User Info Header */}
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-800/50 border border-zinc-800">
                            <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                <span className="text-lg font-bold text-indigo-400">
                                    {user.fullName.substring(0, 2).toUpperCase()}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium text-lg text-zinc-100">
                                    {user.fullName}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                    <Mail className="h-3.5 w-3.5" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <Calendar className="h-3 w-3" />
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {/* Workspaces Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-zinc-400" />
                                    Workspaces ({user.workspaces.length})
                                </h4>
                            </div>

                            <div className="h-[300px] pr-4 overflow-y-auto custom-scrollbar">
                                <div className="space-y-3">
                                    {user.workspaces.length > 0 ? (
                                        user.workspaces.map((workspace) => (
                                            <div
                                                key={workspace.workspaceId}
                                                className="rounded-lg border border-zinc-800 bg-zinc-800/30 p-4 space-y-3 hover:border-zinc-700 transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h5 className="font-medium text-zinc-200">
                                                            {workspace.name}
                                                        </h5>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-zinc-800 text-zinc-400 hover:bg-zinc-700 text-[10px]"
                                                            >
                                                                {workspace.role}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10"
                                                    >
                                                        <CreditCard className="h-3 w-3 mr-1" />
                                                        {workspace.planName}
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/50">
                                                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                                                        <Crown className="h-3 w-3 text-amber-500" />
                                                        Owner: <span className="text-zinc-300">{workspace.ownerName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                                                        <Users className="h-3 w-3 text-blue-500" />
                                                        Members: <span className="text-zinc-300">{workspace.memberCount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-zinc-500 text-sm italic">
                                            No workspaces found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-red-400">
                        Failed to load user details
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

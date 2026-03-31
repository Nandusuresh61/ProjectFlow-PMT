import { useState, useEffect, useCallback } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import type { Project } from '../../types/sidebar.types';
import { IssueCreationModal } from './components/IssueCreationModal';
import { getProjectIssues } from '@/services/issue/issue.api';
import { getMembers } from '@/services/workspace/team.api';
import { toast } from 'sonner';

interface ProjectBacklogViewProps {
    project: Project;
}

const priorityDot: Record<string, string> = {
    HIGH: 'bg-rose-500',
    MEDIUM: 'bg-amber-400',
    LOW: 'bg-emerald-400',
};

export const ProjectBacklogView = ({ project }: ProjectBacklogViewProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [issues, setIssues] = useState<any[]>([]);
    const [membersMap, setMembersMap] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchIssues = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await getProjectIssues(project.id);
            setIssues(res.data || []);
        } catch (error: any) {
            toast.error(error.message || "Failed to load issues");
        } finally {
            setIsLoading(false);
        }
    }, [project.id]);

    useEffect(() => {
        fetchIssues();
    }, [fetchIssues]);

    useEffect(() => {
        if (project.workspaceId) {
            getMembers(project.workspaceId).then(res => {
                if (res?.data) {
                    const map: Record<string, any> = {};
                    res.data.forEach((m: any) => {
                        map[m.userId] = m;
                    });
                    setMembersMap(map);
                }
            }).catch(() => {});
        }
    }, [project.workspaceId]);

    const handleIssueCreated = () => {
        setIsModalOpen(false);
        fetchIssues();
    };

    const getAssigneeInitials = (assigneeId: string) => {
        if (!assigneeId) return '--';
        const member = membersMap[assigneeId];
        if (!member) return '--';
        return member.fullName.substring(0, 2).toUpperCase();
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Backlogs</h1>
                    <p className="text-[#576CBC]/50 text-sm font-medium mt-0.5">{project.name} · {issues.length} issues</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#A5D7E8] text-[#060d1a] text-sm font-bold rounded-xl hover:bg-white transition-all"
                >
                    <Plus size={15} />
                    Add Issue
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                        type="text"
                        placeholder="Search issues..."
                        className="w-full bg-white/[0.04] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-white/[0.07] transition-colors"
                    />
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/[0.07] transition-all">
                    <Filter size={13} />
                    Filter
                </button>
            </div>

            {/* Issue table */}
            <div className="bg-white/[0.025] rounded-2xl overflow-hidden">
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/[0.05]">
                    <span className="text-xs font-bold text-white/25 uppercase tracking-wider">Issue</span>
                    <span className="text-xs font-bold text-white/25 uppercase tracking-wider">Priority</span>
                    <span className="text-xs font-bold text-white/25 uppercase tracking-wider">Assignee</span>
                    <span className="text-xs font-bold text-white/25 uppercase tracking-wider">Est.</span>
                </div>
                <div className="divide-y divide-white/[0.03]">
                    {isLoading ? (
                        <div className="px-5 py-8 text-center text-[#576CBC]/60 text-sm">Loading issues...</div>
                    ) : issues.length === 0 ? (
                        <div className="px-5 py-8 text-center text-[#576CBC]/60 text-sm">No issues found. Create one.</div>
                    ) : (
                        issues.map(issue => (
                            <div key={issue.issueId} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-white/[0.025] transition-colors group cursor-pointer">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-xs font-mono text-white/25 flex-shrink-0">{issue.issueKey}</span>
                                    <span className="text-sm text-white/80 group-hover:text-white transition-colors truncate">{issue.title}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[issue.priority] || 'bg-gray-400'}`} />
                                    <span className="text-xs text-white/40">{issue.priority}</span>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-[#19376D] flex items-center justify-center text-[9px] font-black text-[#A5D7E8]">
                                    {getAssigneeInitials(issue.assigneeId)}
                                </div>
                                <span className="text-xs text-white/30 text-right w-6">{issue.sizeLabel || '--'}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <IssueCreationModal 
                open={isModalOpen} 
                onOpenChange={setIsModalOpen} 
                project={project}
                onSuccess={handleIssueCreated}
            />
        </div>
    );
};

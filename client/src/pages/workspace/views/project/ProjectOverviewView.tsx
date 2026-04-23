import { useState, useEffect } from 'react';
import { FolderKanban, ListTodo, Users, PencilLine, Loader2, BarChart2, Clock } from 'lucide-react';
import type { Project } from '../../types/sidebar.types';
import { getProjectOverview, type ProjectOverview } from '../../../../services/project/project.api';

interface ProjectOverviewViewProps {
    project: Project;
    onEditProject: () => void;
    canEditProject: boolean;
}

const priorityColor: Record<string, string> = {
    HIGH: 'text-rose-400',
    MEDIUM: 'text-amber-400',
    LOW: 'text-emerald-400',
};

const statusStyle: Record<string, string> = {
    'IN_PROGRESS': 'bg-[#A5D7E8]/10 text-[#A5D7E8]',
    'TODO': 'bg-white/5 text-white/40',
    'BACKLOG': 'bg-white/5 text-white/40',
    'REVIEW': 'bg-[#576CBC]/10 text-[#576CBC]',
    'DONE': 'bg-emerald-400/10 text-emerald-400',
};

const statusLabel: Record<string, string> = {
    'IN_PROGRESS': 'In Progress',
    'TODO': 'To Do',
    'BACKLOG': 'Backlog',
    'REVIEW': 'Review',
    'DONE': 'Done',
};

export const ProjectOverviewView = ({ project, onEditProject, canEditProject }: ProjectOverviewViewProps) => {
    const [overview, setOverview] = useState<ProjectOverview | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOverview = async () => {
            if (!project.id) return;
            
            try {
                const response = await getProjectOverview(project.id);
                if (response.success && response.data) {
                    setOverview(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch project overview:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, [project.id]);

    const STATS = [
        { 
            label: 'Open Issues', 
            value: overview?.openIssuesCount.toString() || '0', 
            icon: ListTodo, 
            color: '#A5D7E8' 
        },
        { 
            label: 'Team Members', 
            value: overview?.teamMembersCount.toString() || project.memberIds.length.toString(), 
            icon: Users, 
            color: '#7C9AC7' 
        },
        { 
            label: 'Sprint Progress', 
            value: '64%', 
            icon: BarChart2, 
            color: '#576CBC' 
        },
        { 
            label: 'Days Left', 
            value: '12', 
            icon: Clock, 
            color: '#A5D7E8' 
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-[#A5D7E8] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page heading */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-[#060d1a]"
                        style={{ backgroundColor: project.color }}
                    >
                        {project.key}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black text-white tracking-tight">{project.name}</h1>
                            {canEditProject && (
                                <button
                                    onClick={onEditProject}
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#A5D7E8] hover:bg-white/[0.07] transition-all"
                                >
                                    <PencilLine size={14} />
                                    Edit Project
                                </button>
                            )}
                        </div>
                        <p className="text-[#576CBC]/50 text-sm font-medium">Project overview</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {STATS.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-white/[0.025] rounded-2xl p-5 border border-white/[0.02]">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em]">{label}</p>
                            <Icon size={16} style={{ color }} className="opacity-60" />
                        </div>
                        <p className="text-3xl font-black text-white tracking-tight">
                            {value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Recent issues */}
            <div className="bg-white/[0.025] rounded-2xl border border-white/[0.02] overflow-hidden">
                <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FolderKanban size={16} className="text-white/30" />
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Recent Issues</span>
                    </div>
                    <button className="text-xs font-bold text-[#A5D7E8] hover:underline">View all</button>
                </div>
                <div className="divide-y divide-white/[0.03]">
                    {overview?.recentIssues && overview.recentIssues.length > 0 ? (
                        overview.recentIssues.map(issue => (
                            <div key={issue.issueId} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group">
                                <span className="text-xs font-mono text-white/20 w-16 flex-shrink-0 group-hover:text-white/40 transition-colors">
                                    {issue.issueKey}
                                </span>
                                <p className="text-sm text-white/80 flex-1 truncate font-medium">{issue.title}</p>
                                <span className={`text-[10px] font-black uppercase tracking-wider flex-shrink-0 ${priorityColor[issue.priority]}`}>
                                    {issue.priority}
                                </span>
                                <div 
                                    className="w-7 h-7 rounded-full bg-[#19376D] flex items-center justify-center text-[10px] font-black text-[#A5D7E8] flex-shrink-0 border border-white/5"
                                    title={issue.assigneeName || 'Unassigned'}
                                >
                                    {issue.assigneeInitials || '--'}
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0 border border-white/5 ${statusStyle[issue.status]}`}>
                                    {statusLabel[issue.status]}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="px-5 py-10 text-center">
                            <p className="text-white/20 text-sm font-medium">No issues found in this project</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

import { Plus, Filter, Search } from 'lucide-react';
import type { Project } from '../../types/sidebar.types';

interface ProjectBacklogViewProps {
    project: Project;
}

interface BacklogIssue {
    id: string;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    assignee: string;
    estimate: string;
}

const BACKLOG_ISSUES: BacklogIssue[] = [
    { id: 'PF-248', title: 'Implement OAuth with GitHub', priority: 'High', assignee: 'AK', estimate: '3h' },
    { id: 'PF-247', title: 'Add keyboard shortcuts', priority: 'Medium', assignee: 'SM', estimate: '2h' },
    { id: 'PF-246', title: 'Dark mode improvements', priority: 'Low', assignee: '--', estimate: '1h' },
    { id: 'PF-245', title: 'Export to CSV feature', priority: 'Medium', assignee: 'JD', estimate: '4h' },
    { id: 'PF-244', title: 'Email notification digest', priority: 'Low', assignee: '--', estimate: '5h' },
    { id: 'PF-243', title: 'Audit log viewer', priority: 'High', assignee: 'LT', estimate: '6h' },
];

const priorityDot: Record<string, string> = {
    High: 'bg-rose-500',
    Medium: 'bg-amber-400',
    Low: 'bg-emerald-400',
};

export const ProjectBacklogView = ({ project }: ProjectBacklogViewProps) => (
    <div className="space-y-5">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Backlogs</h1>
                <p className="text-[#576CBC]/50 text-sm font-medium mt-0.5">{project.name} · {BACKLOG_ISSUES.length} issues</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#A5D7E8] text-[#060d1a] text-sm font-bold rounded-xl hover:bg-white transition-all">
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
                {BACKLOG_ISSUES.map(issue => (
                    <div key={issue.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-white/[0.025] transition-colors group cursor-pointer">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs font-mono text-white/25 flex-shrink-0">{issue.id}</span>
                            <span className="text-sm text-white/80 group-hover:text-white transition-colors truncate">{issue.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[issue.priority]}`} />
                            <span className="text-xs text-white/40">{issue.priority}</span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-[#19376D] flex items-center justify-center text-[9px] font-black text-[#A5D7E8]">
                            {issue.assignee}
                        </div>
                        <span className="text-xs text-white/30 text-right">{issue.estimate}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

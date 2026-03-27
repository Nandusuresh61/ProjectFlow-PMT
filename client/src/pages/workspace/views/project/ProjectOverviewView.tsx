import { FolderKanban, ListTodo, Users, BarChart2, Clock } from 'lucide-react';
import type { Project } from '../../types/sidebar.types';

interface ProjectOverviewViewProps {
    project: Project;
}

const STATS = [
    { label: 'Open Issues', value: '24', icon: ListTodo, color: '#A5D7E8' },
    { label: 'Team Members', value: '8', icon: Users, color: '#7C9AC7' },
    { label: 'Sprint Progress', value: '64%', icon: BarChart2, color: '#576CBC' },
    { label: 'Days Left', value: '5', icon: Clock, color: '#A5D7E8' },
];

const RECENT_ISSUES = [
    { id: 'PF-245', title: 'Fix sidebar animation glitch', priority: 'High', assignee: 'JD', status: 'In Progress' },
    { id: 'PF-244', title: 'Update onboarding flow', priority: 'Medium', assignee: 'SM', status: 'To Do' },
    { id: 'PF-243', title: 'API rate limiting', priority: 'High', assignee: 'AK', status: 'In Progress' },
    { id: 'PF-242', title: 'Profile avatar upload', priority: 'Low', assignee: 'LT', status: 'Done' },
];

const priorityColor: Record<string, string> = {
    High: 'text-rose-400',
    Medium: 'text-amber-400',
    Low: 'text-emerald-400',
};

const statusStyle: Record<string, string> = {
    'In Progress': 'bg-[#A5D7E8]/10 text-[#A5D7E8]',
    'To Do': 'bg-white/5 text-white/40',
    'Done': 'bg-emerald-400/10 text-emerald-400',
};

export const ProjectOverviewView = ({ project }: ProjectOverviewViewProps) => (
    <div className="space-y-6">
        {/* Page heading */}
        <div className="flex items-center gap-3">
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-[#060d1a]"
                style={{ backgroundColor: project.color }}
            >
                {project.key}
            </div>
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">{project.name}</h1>
                <p className="text-[#576CBC]/50 text-sm font-medium">Project overview</p>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {STATS.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white/[0.025] rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-white/30 uppercase tracking-wider">{label}</p>
                        <Icon size={15} style={{ color }} className="opacity-60" />
                    </div>
                    <p className="text-3xl font-black text-white">{value}</p>
                </div>
            ))}
        </div>

        {/* Recent issues */}
        <div className="bg-white/[0.025] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FolderKanban size={16} className="text-white/30" />
                    <span className="text-sm font-bold text-white">Recent Issues</span>
                </div>
                <button className="text-xs font-bold text-[#A5D7E8] hover:underline">View all</button>
            </div>
            <div className="divide-y divide-white/[0.03]">
                {RECENT_ISSUES.map(issue => (
                    <div key={issue.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                        <span className="text-xs font-mono text-white/25 w-14 flex-shrink-0">{issue.id}</span>
                        <p className="text-sm text-white/80 flex-1 truncate">{issue.title}</p>
                        <span className={`text-xs font-bold flex-shrink-0 ${priorityColor[issue.priority]}`}>{issue.priority}</span>
                        <div className="w-6 h-6 rounded-full bg-[#19376D] flex items-center justify-center text-[9px] font-black text-[#A5D7E8] flex-shrink-0">
                            {issue.assignee}
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${statusStyle[issue.status]}`}>
                            {issue.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

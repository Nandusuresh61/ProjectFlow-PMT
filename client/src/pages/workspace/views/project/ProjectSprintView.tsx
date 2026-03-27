import { Zap, Calendar, CheckCircle2, Circle, Clock } from 'lucide-react';
import type { Project } from '../../types/sidebar.types';

interface ProjectSprintViewProps {
    project: Project;
}

interface SprintIssue {
    id: string;
    title: string;
    assignee: string;
    status: 'todo' | 'in-progress' | 'done';
    points: number;
}

const SPRINT_ISSUES: SprintIssue[] = [
    { id: 'PF-245', title: 'Fix sidebar animation glitch', assignee: 'JD', status: 'in-progress', points: 3 },
    { id: 'PF-243', title: 'API rate limiting', assignee: 'AK', status: 'in-progress', points: 5 },
    { id: 'PF-242', title: 'Profile avatar upload', assignee: 'LT', status: 'done', points: 2 },
    { id: 'PF-241', title: 'Email verification flow', assignee: 'SM', status: 'done', points: 3 },
    { id: 'PF-240', title: 'Notification preferences', assignee: '--', status: 'todo', points: 2 },
    { id: 'PF-239', title: 'Search functionality', assignee: '--', status: 'todo', points: 8 },
];

const statusIcon = {
    'todo': <Circle size={15} className="text-white/20" />,
    'in-progress': <Zap size={15} className="text-[#A5D7E8]" />,
    'done': <CheckCircle2 size={15} className="text-emerald-400" />,
};

const statusLabel = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done',
};

export const ProjectSprintView = ({ project }: ProjectSprintViewProps) => {
    const total = SPRINT_ISSUES.reduce((s, i) => s + i.points, 0);
    const done = SPRINT_ISSUES.filter(i => i.status === 'done').reduce((s, i) => s + i.points, 0);
    const pct = Math.round((done / total) * 100);

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Sprint 12</h1>
                <p className="text-[#576CBC]/50 text-sm font-medium mt-0.5">{project.name} · Active sprint</p>
            </div>

            {/* Sprint meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/[0.025] rounded-2xl p-4 flex items-center gap-3">
                    <Calendar size={17} className="text-[#A5D7E8] opacity-60" />
                    <div>
                        <p className="text-xs font-bold text-white/25 uppercase tracking-wider mb-0.5">Sprint Period</p>
                        <p className="text-sm font-semibold text-white">Mar 18 – Mar 28</p>
                    </div>
                </div>
                <div className="bg-white/[0.025] rounded-2xl p-4 flex items-center gap-3">
                    <Clock size={17} className="text-amber-400 opacity-60" />
                    <div>
                        <p className="text-xs font-bold text-white/25 uppercase tracking-wider mb-0.5">Days Remaining</p>
                        <p className="text-sm font-semibold text-white">5 days</p>
                    </div>
                </div>
                <div className="bg-white/[0.025] rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-white/25 uppercase tracking-wider">Progress</p>
                        <span className="text-sm font-bold text-white">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#A5D7E8] rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                    <p className="text-xs text-white/25 mt-1">{done}/{total} story points</p>
                </div>
            </div>

            {/* Issue list */}
            <div className="bg-white/[0.025] rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/[0.05]">
                    <span className="text-sm font-bold text-white/50">Sprint Issues</span>
                </div>
                <div className="divide-y divide-white/[0.03]">
                    {SPRINT_ISSUES.map(issue => (
                        <div key={issue.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                            {statusIcon[issue.status]}
                            <span className="text-xs font-mono text-white/20 w-12 flex-shrink-0">{issue.id}</span>
                            <p className={`text-sm flex-1 truncate ${issue.status === 'done' ? 'text-white/30 line-through' : 'text-white/80'}`}>
                                {issue.title}
                            </p>
                            <span className="text-xs text-white/25 px-2 py-0.5 bg-white/[0.04] rounded-lg">
                                {statusLabel[issue.status]}
                            </span>
                            <div className="w-6 h-6 rounded-full bg-[#19376D] flex items-center justify-center text-[9px] font-black text-[#A5D7E8]">
                                {issue.assignee}
                            </div>
                            <span className="text-xs font-bold text-white/25 w-8 text-right">{issue.points}pt</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

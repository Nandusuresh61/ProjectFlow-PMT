import {
    FolderOpen,
    ListTodo,
    Users,
    BarChart3,
    Plus,
    Zap
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '../../components/Card';


interface Stat {
    label: string;
    value: string;
    trend?: string;
    trendColor?: string;
    sub: string;
    icon: LucideIcon;
}

interface Activity {
    id: string;
    user: string;
    name: string;
    action: string;
    obj: string;
    time: string;
    type: string;
}

interface DashboardViewProps {
    openInvite: () => void;
}

export const DashboardView = ({ openInvite }: DashboardViewProps) => {
    const stats: Stat[] = [
        { label: 'Active Projects', value: '8', trend: '↑ 12%', trendColor: 'text-emerald-400', sub: '2 ending this week', icon: FolderOpen },
        { label: 'Open Issues', value: '134', trend: '↓ 8%', trendColor: 'text-rose-400', sub: '24 assigned to you', icon: ListTodo },
        { label: 'Team Members', value: '42', sub: '5 online now', icon: Users },
        { label: 'Sprint Progress', value: '68%', trend: 'On track', trendColor: 'text-emerald-400', sub: '3 days remaining', icon: BarChart3 },
    ];

    const activities: Activity[] = [
        { id: '1', user: 'JD', name: 'James Doe', action: 'Created Issue', obj: 'PF-245', time: '2 min ago', type: 'Create' },
        { id: '2', user: 'SM', name: 'Sarah Miller', action: 'Completed', obj: 'PF-234', time: '15 min ago', type: 'Complete' },
        { id: '3', user: 'AK', name: 'Alex Kumar', action: 'Commented on', obj: 'PF-228', time: '1 hour ago', type: 'Comment' },
        { id: '4', user: 'LT', name: 'Lisa Thompson', action: 'Started Sprint', obj: 'Sprint 12', time: '2 hours ago', type: 'Sprint' },
    ];

    return (
        <div className="space-y-10">
            <div className="text-left py-2">
                <h1 className="text-2xl sm:text-4xl font-black text-white mb-2">Welcome back, Admin</h1>
                <p className="text-[#576CBC]/60 font-medium tracking-tight">Here's what's happening with your projects today.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} delay={i * 0.1} className="!p-6 !rounded-3xl !border-white/5 !bg-white/[0.03]">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-bold text-[#576CBC]/60 mb-1">{stat.label}</p>
                                <h4 className="text-3xl font-black text-white">{stat.value}</h4>
                            </div>
                            <div className="p-2.5 bg-white/5 rounded-xl text-white/40">
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            {stat.trend && (
                                <span className={`text-[11px] font-bold ${stat.trendColor}`}>{stat.trend}</span>
                            )}
                            <p className="text-[11px] text-[#576CBC]/40 font-medium">{stat.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] overflow-hidden">
                        <div className="px-4 sm:px-10 py-6 sm:py-8 flex justify-between items-center border-b border-white/5">
                            <h3 className="text-lg font-bold text-white tracking-tight">Recent Activity</h3>
                            <button className="text-xs font-bold text-[#A5D7E8] hover:underline">View all</button>
                        </div>
                        <div className="divide-y divide-white/5">
                            {activities.map((act) => (
                                <div key={act.id} className="px-4 sm:px-10 py-4 sm:py-6 flex items-center justify-between group hover:bg-white/[0.02] transition-colors cursor-pointer">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 bg-[#19376D] rounded-full flex items-center justify-center text-[10px] font-black text-[#A5D7E8]">
                                            {act.user}
                                        </div>
                                        <div>
                                            <p className="text-sm text-white/90">
                                                <span className="font-bold">{act.action}</span> <span className="text-white/40 mx-1">{act.obj}</span>
                                            </p>
                                            <p className="text-[11px] text-[#576CBC]/40 mt-1">{act.time}</p>
                                        </div>
                                    </div>
                                    <span className="px-4 py-1.5 rounded-full text-[10px] font-bold border border-white/10 bg-white/5 text-white/60">
                                        {act.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-6 sm:p-10">
                        <h3 className="text-lg font-bold text-white mb-8 tracking-tight">Quick Actions</h3>
                        <div className="space-y-4">
                            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#A5D7E8]/30 hover:bg-white/[0.08] transition-all group">
                                <Plus size={18} className="text-[#A5D7E8]" />
                                <span className="text-sm font-bold text-white/90">Create Project</span>
                            </button>
                            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#A5D7E8]/30 hover:bg-white/[0.08] transition-all group">
                                <Zap size={18} className="text-[#A5D7E8]" />
                                <span className="text-sm font-bold text-white/90">New Sprint</span>
                            </button>
                            <button onClick={openInvite} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#A5D7E8]/30 hover:bg-white/[0.08] transition-all group">
                                <Users size={18} className="text-[#A5D7E8]" />
                                <span className="text-sm font-bold text-white/90">Invite Member</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

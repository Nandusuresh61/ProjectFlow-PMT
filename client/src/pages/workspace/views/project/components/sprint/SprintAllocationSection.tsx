import { Users, CheckCircle2, Circle, BarChart3, Info } from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Legend
} from 'recharts';
import { type SprintAllocationData } from '@/services/sprint/sprint.api';

interface SprintAllocationSectionProps {
    allocation: SprintAllocationData | null;
}

const statusColors = {
    UNDERLOADED: 'text-white/40 bg-white/[0.03]',
    HEALTHY: 'text-emerald-400 bg-emerald-400/10',
    OVERLOADED: 'text-rose-400 bg-rose-400/10',
};

const statusLabels = {
    UNDERLOADED: 'Underloaded',
    HEALTHY: 'Healthy',
    OVERLOADED: 'Overloaded',
};

export const SprintAllocationSection = ({ allocation }: SprintAllocationSectionProps) => {
    if (!allocation || allocation.members.length === 0) {
        return null;
    }

    const chartData = allocation.members.map(member => ({
        name: member.fullName.split(' ')[0],
        assigned: member.assignedHours,
        logged: member.loggedHours,
        remaining: member.remainingHours,
    }));

    const getCapacityInsight = () => {
        const overloaded = allocation.members.filter(m => m.capacityStatus === 'OVERLOADED');
        const underloaded = allocation.members.filter(m => m.capacityStatus === 'UNDERLOADED');
        
        if (overloaded.length > 0) {
            return `${overloaded[0].fullName} is overloaded. Consider reassigning some tasks.`;
        }
        if (underloaded.length > 0) {
            return `${underloaded[0].fullName} has available capacity.`;
        }
        return "Team workload is well-balanced.";
    };

    return (
        <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#A5D7E8]/10 flex items-center justify-center">
                        <Users size={18} className="text-[#A5D7E8]" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Team Workload & Capacity</h2>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-lg">
                    <Info size={14} className="text-white/30" />
                    <span className="text-xs font-medium text-white/50">{getCapacityInsight()}</span>
                </div>
            </div>

            {/* Allocation Chart */}
            <div className="bg-white/[0.025] border border-white/[0.05] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart3 size={16} className="text-white/20" />
                    <span className="text-xs font-black text-white/40 uppercase tracking-widest">Workload Distribution</span>
                </div>
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }}
                            />
                            <Tooltip 
                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                contentStyle={{ 
                                    backgroundColor: '#0B2447', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '700'
                                }}
                                itemStyle={{ padding: '2px 0' }}
                            />
                            <Legend 
                                verticalAlign="top" 
                                align="right" 
                                iconType="circle"
                                wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            />
                            <Bar dataKey="assigned" name="Assigned (h)" fill="#576CBC" radius={[4, 4, 0, 0]} barSize={32} />
                            <Bar dataKey="logged" name="Logged (h)" fill="#A5D7E8" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Member Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allocation.members.map(member => (
                    <div key={member.userId} className="bg-white/[0.025] border border-white/[0.05] rounded-2xl p-5 hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {member.profileImage ? (
                                    <img src={member.profileImage} alt={member.fullName} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-[#19376D] flex items-center justify-center text-xs font-black text-[#A5D7E8]">
                                        {member.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-sm font-bold text-white truncate max-w-[120px]">{member.fullName}</h3>
                                    <div className={`mt-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${statusColors[member.capacityStatus]}`}>
                                        {statusLabels[member.capacityStatus]}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white/[0.02] rounded-xl p-2.5">
                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Assigned</p>
                                    <p className="text-sm font-black text-white">{member.assignedHours}h</p>
                                </div>
                                <div className="bg-white/[0.02] rounded-xl p-2.5">
                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Logged</p>
                                    <p className="text-sm font-black text-[#A5D7E8]">{member.loggedHours}h</p>
                                </div>
                            </div>

                            <div className="bg-[#A5D7E8]/[0.02] border border-[#A5D7E8]/10 rounded-xl p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Remaining</span>
                                    <span className="text-xs font-black text-[#A5D7E8]">{member.remainingHours}h</span>
                                </div>
                                <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#A5D7E8] rounded-full" 
                                        style={{ width: `${member.assignedHours > 0 ? (member.loggedHours / member.assignedHours) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 size={12} className="text-emerald-400/50" />
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{member.completedTasks} Done</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Circle size={12} className="text-white/10" />
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{member.incompleteTasks} Open</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

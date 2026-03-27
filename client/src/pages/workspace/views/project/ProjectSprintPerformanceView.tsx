import { TrendingUp, TrendingDown, BarChart2, CheckCircle2, XCircle } from 'lucide-react';
import type { Project } from '../../types/sidebar.types';

interface ProjectSprintPerformanceViewProps {
    project: Project;
}

const VELOCITY_BARS = [
    { sprint: 'S9', planned: 24, completed: 20 },
    { sprint: 'S10', planned: 28, completed: 26 },
    { sprint: 'S11', planned: 26, completed: 28 },
    { sprint: 'S12', planned: 30, completed: 18 },
];

const METRICS = [
    { label: 'Velocity', value: '23 pts', trend: '+4', up: true },
    { label: 'Completion Rate', value: '78%', trend: '-6%', up: false },
    { label: 'Avg Cycle Time', value: '2.4d', trend: '-0.3d', up: true },
    { label: 'Bug Escape Rate', value: '4%', trend: '-1%', up: true },
];

const max = Math.max(...VELOCITY_BARS.map(b => b.planned));

export const ProjectSprintPerformanceView = ({ project }: ProjectSprintPerformanceViewProps) => (
    <div className="space-y-5">
        <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Sprint Performance</h1>
            <p className="text-[#576CBC]/50 text-sm font-medium mt-0.5">{project.name} · Historical view</p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {METRICS.map(m => (
                <div key={m.label} className="bg-white/[0.025] rounded-2xl p-4">
                    <p className="text-xs font-bold text-white/25 uppercase tracking-wider mb-2">{m.label}</p>
                    <p className="text-3xl font-black text-white mb-1">{m.value}</p>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${m.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {m.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {m.trend} vs last sprint
                    </div>
                </div>
            ))}
        </div>

        {/* Velocity chart (CSS-based) */}
        <div className="bg-white/[0.025] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-6">
                <BarChart2 size={16} className="text-white/30" />
                <span className="text-sm font-bold text-white/70">Sprint Velocity</span>
                <div className="flex items-center gap-3 ml-auto text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-white/30">
                        <span className="w-2.5 h-2.5 rounded-sm bg-white/10" /> Planned
                    </span>
                    <span className="flex items-center gap-1.5 text-[#A5D7E8]">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#A5D7E8]/60" /> Completed
                    </span>
                </div>
            </div>

            <div className="flex items-end gap-4 h-36">
                {VELOCITY_BARS.map(bar => (
                    <div key={bar.sprint} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex items-end gap-1 h-28">
                            <div
                                className="flex-1 bg-white/[0.06] rounded-t-lg"
                                style={{ height: `${(bar.planned / max) * 100}%` }}
                            />
                            <div
                                className="flex-1 bg-[#A5D7E8]/50 rounded-t-lg"
                                style={{ height: `${(bar.completed / max) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs font-bold text-white/25">{bar.sprint}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Goal completion */}
        <div className="bg-white/[0.025] rounded-2xl p-5">
            <p className="text-sm font-bold text-white/50 mb-4">Sprint Goals</p>
            <div className="space-y-3">
                {[
                    { goal: 'Ship new onboarding flow', done: true },
                    { goal: 'Fix critical auth bugs', done: true },
                    { goal: 'Complete API documentation', done: false },
                    { goal: 'Deploy to production', done: false },
                ].map((g, i) => (
                    <div key={i} className="flex items-center gap-3">
                        {g.done
                            ? <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                            : <XCircle size={16} className="text-white/15 flex-shrink-0" />
                        }
                        <span className={`text-sm ${g.done ? 'text-white/40 line-through' : 'text-white/70'}`}>{g.goal}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

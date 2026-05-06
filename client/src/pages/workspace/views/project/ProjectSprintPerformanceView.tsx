import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart2, CheckCircle2, Loader2 } from 'lucide-react';
import type { Project } from '../../types/sidebar.types';
import { getProjectPerformance, type PerformanceData } from '@/services/sprint/sprint.api';
import { useWorkspaceStore } from "@/store/workspace.store";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";
import { Briefcase } from "lucide-react";

interface ProjectSprintPerformanceViewProps {
    project: Project;
}

export const ProjectSprintPerformanceView = ({ project }: ProjectSprintPerformanceViewProps) => {
    const role = useWorkspaceStore(state => state.currentWorkspaceRole);
    const isMemberOrViewer = role === WorkspaceRoleEnum.WORKSPACE_MEMBER || role === WorkspaceRoleEnum.WORKSPACE_VIEWER;


    const [performance, setPerformance] = useState<PerformanceData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isMemberOrViewer) return;
        const fetchPerformance = async () => {
            try {
                setLoading(true);
                const response = await getProjectPerformance(project.id);
                if (response.success && response.data) {
                    setPerformance(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch performance data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformance();
    }, [project.id, isMemberOrViewer]);

    if (isMemberOrViewer) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                    <Briefcase className="text-white/20" size={24} />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">Access Restricted</h3>
                    <p className="text-white/40 text-sm max-w-xs mt-1">
                        You don't have the required permissions to view this section. Please contact your workspace administrator.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="w-8 h-8 text-[#A5D7E8] animate-spin" />
                <p className="text-white/50 text-sm font-medium">Analyzing performance...</p>
            </div>
        );
    }

    if (!performance || performance.velocityBars.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                    <BarChart2 className="text-white/20" size={24} />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">No Performance Data</h3>
                    <p className="text-white/40 text-sm max-w-xs mt-1">
                        Complete at least one sprint to see performance metrics and velocity trends.
                    </p>
                </div>
            </div>
        );
    }

    const { metrics, velocityBars } = performance;
    const maxVal = Math.max(...velocityBars.flatMap(b => [b.planned, b.completed]), 10);

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Sprint Performance</h1>
                <p className="text-[#576CBC]/50 text-sm font-medium mt-0.5">{project.name} · Historical view</p>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {metrics.map(m => (
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

                <div className="flex items-end gap-4 h-48 pt-4">
                    {velocityBars.map(bar => (
                        <div key={bar.sprint} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full flex items-end gap-1.5 h-32 relative">
                                <div
                                    className="flex-1 bg-white/[0.06] rounded-t-lg transition-all group-hover:bg-white/[0.1]"
                                    style={{ height: `${(bar.planned / maxVal) * 100}%` }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/4 -translate-x-1/2 text-[10px] font-bold text-white/40">
                                        {bar.planned}
                                    </div>
                                </div>
                                <div
                                    className="flex-1 bg-[#A5D7E8]/50 rounded-t-lg transition-all group-hover:bg-[#A5D7E8]/70"
                                    style={{ height: `${(bar.completed / maxVal) * 100}%` }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-6 right-1/4 translate-x-1/2 text-[10px] font-bold text-[#A5D7E8]">
                                        {bar.completed}
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-white/25 truncate w-full text-center">{bar.sprint}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Historical Insight */}
            <div className="bg-white/[0.025] rounded-2xl p-5 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span className="text-sm font-bold text-white/70">Efficiency Insight</span>
                </div>
                <p className="text-sm text-white/40 leading-relaxed">
                    Based on the last {velocityBars.length} sprints, your team's velocity is {metrics[0].value}. 
                    The completion rate of {metrics[1].value} suggests {parseInt(metrics[1].value) > 80 ? 'excellent' : 'steady'} predictability in sprint planning.
                </p>
            </div>
        </div>
    );
};

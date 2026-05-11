import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    X, Calendar, CheckCircle2, Circle, Clock, Loader2, AlertCircle,
    TrendingUp, Percent, RotateCcw, Timer, Hourglass, Target, Flag,
    ArrowRight, GitMerge, Layers, Bug, BookOpen, Archive, Info,
} from 'lucide-react';
import { getSprintHistoryDetails, type SprintHistoryDetailsData, type SprintHistoryIssue } from '@/services/sprint/sprint.api';
import { SprintBurndownChart } from './SprintBurndownChart';
import { SprintAllocationSection } from './SprintAllocationSection';

interface CompletedSprintDetailsModalProps {
    sprintId: string;
    sprintName: string;
    onClose: () => void;
}

// ─── helpers ───────────────────────────────────────────────────────────────

const statusIcon: Record<string, React.ReactNode> = {
    TODO: <Circle size={13} className="text-white/20" />,
    IN_PROGRESS: <Clock size={13} className="text-[#A5D7E8]" />,
    DONE: <CheckCircle2 size={13} className="text-emerald-400" />,
    BACKLOG: <Circle size={13} className="text-white/10" />,
    REVIEW: <Clock size={13} className="text-amber-400" />,
};

const statusLabel: Record<string, string> = {
    BACKLOG: 'Backlog',
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    REVIEW: 'Review',
    DONE: 'Done',
};

const typeIcon: Record<string, React.ReactNode> = {
    STORY: <BookOpen size={12} className="text-violet-400" />,
    TASK: <Layers size={12} className="text-[#A5D7E8]" />,
    BUG: <Bug size={12} className="text-rose-400" />,
};

const priorityDot: Record<string, string> = {
    HIGH: 'bg-rose-400',
    MEDIUM: 'bg-amber-400',
    LOW: 'bg-emerald-400/60',
};

const fmt = (d?: string | null) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

// ─── Metric card ───────────────────────────────────────────────────────────

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    sub?: string;
}
const MetricCard = ({ icon, label, value, sub }: MetricCardProps) => (
    <div className="bg-white/[0.025] rounded-2xl p-4">
        <div className="flex items-center gap-2 text-white/25 mb-2">
            {icon}
            <p className="text-[10px] font-bold uppercase tracking-wider">{label}</p>
        </div>
        <p className="text-2xl font-black text-white">{value}</p>
        {sub && <p className="text-xs text-white/25 mt-0.5">{sub}</p>}
    </div>
);

// ─── Issue row ─────────────────────────────────────────────────────────────

const IssueRow = ({ issue }: { issue: SprintHistoryIssue }) => (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
        <div className="flex-shrink-0">{statusIcon[issue.status] ?? statusIcon.TODO}</div>
        <div className="flex-shrink-0">{typeIcon[issue.type]}</div>
        <span className="text-[10px] font-mono text-white/20 w-16 flex-shrink-0">{issue.issueKey}</span>
        <p className={`text-sm flex-1 truncate ${issue.status === 'DONE' ? 'text-white/35 line-through' : 'text-white/80'}`}>
            {issue.title}
        </p>
        {issue.continuedIssueId && (
            <span className="flex-shrink-0 flex items-center gap-1 text-[9px] font-black text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                <GitMerge size={9} /> Continued
            </span>
        )}
        <span className="text-[10px] font-bold text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-lg uppercase tracking-wider flex-shrink-0">
            {statusLabel[issue.status] ?? issue.status}
        </span>
        <div className="flex-shrink-0 flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[issue.priority] ?? 'bg-white/20'}`} />
        </div>
        {(issue.storyPoints ?? issue.estimatedHours) && (
            <span className="text-xs font-bold text-white/25 w-14 text-right flex-shrink-0">
                {issue.type === 'TASK' ? `${issue.estimatedHours ?? 0}h` : `${issue.storyPoints ?? 0}pt`}
            </span>
        )}
    </div>
);

// ─── Story with tasks ──────────────────────────────────────────────────────

const StoryWithTasks = ({ story, allIssues }: { story: SprintHistoryIssue; allIssues: SprintHistoryIssue[] }) => {
    const childTasks = allIssues.filter((i) => i.parentId === story.issueId);
    return (
        <div>
            <IssueRow issue={story} />
            {childTasks.length > 0 && (
                <div className="border-l border-white/[0.04] ml-8">
                    {childTasks.map((task) => (
                        <div key={task.issueId} className="relative">
                            <div className="absolute left-0 top-1/2 w-3 border-t border-white/[0.04]" />
                            <IssueRow issue={task} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Main Modal ────────────────────────────────────────────────────────────

export const CompletedSprintDetailsModal = ({
    sprintId,
    sprintName,
    onClose,
}: CompletedSprintDetailsModalProps) => {
    const [data, setData] = useState<SprintHistoryDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'board' | 'burndown' | 'allocation' | 'spillover'>('overview');

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getSprintHistoryDetails(sprintId);
            if (res.success && res.data) {
                setData(res.data);
            } else {
                setError('Failed to load sprint details.');
            }
        } catch {
            setError('Failed to load sprint details.');
        } finally {
            setLoading(false);
        }
    }, [sprintId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    // ── Derived data ─────────────────────────────────────────────────────────

    const { topLevelIssues, orphanTasks } = useMemo(() => {
        if (!data) return { topLevelIssues: [], orphanTasks: [] };
        const stories = data.issues.filter((i) => i.type === 'STORY');
        const bugs = data.issues.filter((i) => i.type === 'BUG');
        const tasks = data.issues.filter((i) => i.type === 'TASK');
        const topLevel = [...stories, ...bugs];
        const orphans = tasks.filter((t) => !t.parentId);
        return { topLevelIssues: topLevel, orphanTasks: orphans };
    }, [data]);

    const completionRate = Math.round(data?.analytics?.completionRate ?? 0);

    // ── Tab definitions ──────────────────────────────────────────────────────

    const tabs = [
        { id: 'overview' as const, label: 'Overview' },
        { id: 'board' as const, label: `Issues (${data?.issues?.length ?? 0})` },
        { id: 'burndown' as const, label: 'Burndown' },
        { id: 'allocation' as const, label: 'Allocation' },
        { id: 'spillover' as const, label: `Spillover (${data?.spilloverIssues?.length ?? 0})` },
    ];

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Sprint details: ${sprintName}`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal panel */}
            <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-[#0B2447] border border-white/[0.08] rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-emerald-400/10 flex items-center justify-center flex-shrink-0">
                            <Archive size={16} className="text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-base font-black text-white truncate">{sprintName}</h2>
                            <p className="text-xs text-white/30 font-medium">Completed Sprint · Read-only</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        id="close-sprint-history-modal"
                        className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-colors flex-shrink-0 ml-4"
                        aria-label="Close modal"
                    >
                        <X size={16} className="text-white/50" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 px-6 py-2 border-b border-white/[0.04] flex-shrink-0 overflow-x-auto scrollbar-none">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            id={`sprint-history-tab-${tab.id}`}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-[#A5D7E8]/10 text-[#A5D7E8]'
                                    : 'text-white/35 hover:text-white/60'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {loading && (
                        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
                            <Loader2 className="w-8 h-8 text-[#A5D7E8] animate-spin" />
                            <p className="text-white/40 text-sm font-medium">Loading sprint history…</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center">
                            <AlertCircle className="text-rose-400/60" size={32} />
                            <p className="text-white/40 text-sm">{error}</p>
                        </div>
                    )}

                    {!loading && !error && data && (
                        <>
                            {/* ── OVERVIEW ── */}
                            {activeTab === 'overview' && (
                                <div className="space-y-5">
                                    {/* Sprint overview card */}
                                    <div className="bg-white/[0.025] rounded-2xl p-5 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-white font-black text-lg">{data.sprint.name}</h3>
                                                {data.sprint.goal && (
                                                    <div className="flex items-start gap-2 mt-2">
                                                        <Target size={13} className="text-[#A5D7E8]/50 mt-0.5 flex-shrink-0" />
                                                        <p className="text-sm text-white/50 italic">{data.sprint.goal}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="flex-shrink-0 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest ml-4">
                                                Completed
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div className="bg-white/[0.025] rounded-xl p-3 flex items-center gap-3">
                                                <Calendar size={14} className="text-[#A5D7E8]/60" />
                                                <div>
                                                    <p className="text-[9px] font-bold text-white/25 uppercase tracking-wider mb-0.5">Period</p>
                                                    <p className="text-xs font-semibold text-white">{fmt(data.sprint.startDate)} – {fmt(data.sprint.endDate)}</p>
                                                </div>
                                            </div>
                                            <div className="bg-white/[0.025] rounded-xl p-3 flex items-center gap-3">
                                                <Flag size={14} className="text-violet-400/60" />
                                                <div>
                                                    <p className="text-[9px] font-bold text-white/25 uppercase tracking-wider mb-0.5">Committed</p>
                                                    <p className="text-xs font-semibold text-white">{data.sprint.plannedPoints} pts planned</p>
                                                </div>
                                            </div>
                                            <div className="bg-white/[0.025] rounded-xl p-3">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <p className="text-[9px] font-bold text-white/25 uppercase tracking-wider">Progress</p>
                                                    <span className="text-xs font-bold text-white">{completionRate}%</span>
                                                </div>
                                                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-400 rounded-full transition-all"
                                                        style={{ width: `${completionRate}%` }}
                                                    />
                                                </div>
                                                <p className="text-[9px] text-white/25 mt-1">{data.analytics?.completedStoryPoints ?? 0}/{data.analytics?.committedStoryPoints ?? 0} story points</p>
                                            </div>
                                        </div>

                                        {data.analytics?.completedAt && (
                                            <p className="text-xs text-white/25">
                                                Completed on {fmt(data.analytics.completedAt)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Metric cards */}
                                    {data.analytics ? (
                                        <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
                                            <MetricCard
                                                icon={<TrendingUp size={14} />}
                                                label="Velocity"
                                                value={data.analytics.velocity}
                                                sub="points"
                                            />
                                            <MetricCard
                                                icon={<Percent size={14} />}
                                                label="Completion"
                                                value={`${completionRate}%`}
                                                sub={`${data.analytics.completedIssues}/${data.analytics.committedIssues} issues`}
                                            />
                                            <MetricCard
                                                icon={<RotateCcw size={14} />}
                                                label="Spillover"
                                                value={data.analytics.spilloverStoryPoints}
                                                sub="points"
                                            />
                                            <MetricCard
                                                icon={<Timer size={14} />}
                                                label="Logged"
                                                value={`${data.analytics.loggedHours}h`}
                                                sub={`${data.analytics.committedEstimatedHours}h estimated`}
                                            />
                                            <MetricCard
                                                icon={<Hourglass size={14} />}
                                                label="Remaining"
                                                value={`${data.analytics.remainingHours}h`}
                                                sub="at completion"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 bg-white/[0.02] rounded-2xl p-4">
                                            <Info size={14} className="text-white/20" />
                                            <p className="text-sm text-white/30">No analytics snapshot found for this sprint.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── ISSUES / BOARD ── */}
                            {activeTab === 'board' && (
                                <div className="bg-white/[0.025] rounded-2xl overflow-hidden">
                                    <div className="px-5 py-3 border-b border-white/[0.05] flex items-center justify-between">
                                        <span className="text-sm font-bold text-white/50">Sprint Issues</span>
                                        <span className="text-xs font-medium text-white/20">{data.issues.length} issues</span>
                                    </div>
                                    {data.issues.length === 0 ? (
                                        <div className="px-5 py-12 text-center">
                                            <p className="text-white/20 text-sm font-medium">No completed issues found</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-white/[0.03]">
                                            {topLevelIssues.map((issue) => (
                                                <StoryWithTasks key={issue.issueId} story={issue} allIssues={data.issues} />
                                            ))}
                                            {orphanTasks.map((task) => (
                                                <IssueRow key={task.issueId} issue={task} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── BURNDOWN ── */}
                            {activeTab === 'burndown' && (
                                <>
                                    {data.burndown ? (
                                        <SprintBurndownChart data={data.burndown} />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center min-h-[240px] gap-4 text-center bg-white/[0.015] rounded-2xl border border-dashed border-white/[0.06]">
                                            <AlertCircle size={28} className="text-white/15" />
                                            <div>
                                                <p className="text-white/40 font-medium text-sm">No Burndown Data</p>
                                                <p className="text-white/25 text-xs mt-1">Daily metrics were not captured for this sprint.</p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* ── ALLOCATION ── */}
                            {activeTab === 'allocation' && (
                                <>
                                    {data.allocation && data.allocation.members.length > 0 ? (
                                        <SprintAllocationSection allocation={data.allocation} />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center min-h-[240px] gap-4 text-center bg-white/[0.015] rounded-2xl border border-dashed border-white/[0.06]">
                                            <AlertCircle size={28} className="text-white/15" />
                                            <div>
                                                <p className="text-white/40 font-medium text-sm">No Allocation Data</p>
                                                <p className="text-white/25 text-xs mt-1">Member allocation snapshots were not recorded for this sprint.</p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* ── SPILLOVER ── */}
                            {activeTab === 'spillover' && (
                                <div className="space-y-4">
                                    {data.spilloverIssues.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center min-h-[240px] gap-4 text-center bg-white/[0.015] rounded-2xl border border-dashed border-white/[0.06]">
                                            <CheckCircle2 size={28} className="text-emerald-400/30" />
                                            <div>
                                                <p className="text-white/40 font-medium text-sm">No Spillover</p>
                                                <p className="text-white/25 text-xs mt-1">All issues were completed within this sprint. 🎉</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2 mb-1">
                                                <RotateCcw size={14} className="text-amber-400/60" />
                                                <p className="text-sm font-bold text-white/50">
                                                    {data.spilloverIssues.length} issue{data.spilloverIssues.length > 1 ? 's' : ''} spilled over
                                                </p>
                                            </div>

                                            <div className="bg-white/[0.025] rounded-2xl overflow-hidden divide-y divide-white/[0.03]">
                                                {data.spilloverIssues.map((issue) => (
                                                    <div key={issue.issueId} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                                                        <div className="flex-shrink-0">{typeIcon[issue.type]}</div>
                                                        <span className="text-[10px] font-mono text-white/20 w-16 flex-shrink-0">{issue.issueKey}</span>
                                                        <p className="text-sm flex-1 truncate text-white/70">{issue.title}</p>

                                                        {issue.continuedIssueId && (
                                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-violet-400 flex-shrink-0">
                                                                <ArrowRight size={10} />
                                                                <span>Continued in next sprint</span>
                                                            </div>
                                                        )}
                                                        {issue.continuedFromIssueId && (
                                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 flex-shrink-0">
                                                                <GitMerge size={10} />
                                                                <span>Carried from prev. sprint</span>
                                                            </div>
                                                        )}

                                                        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg uppercase tracking-wider flex-shrink-0">
                                                            {statusLabel[issue.status] ?? issue.status}
                                                        </span>
                                                        {issue.storyPoints != null && (
                                                            <span className="text-xs font-bold text-white/25 w-12 text-right flex-shrink-0">
                                                                {issue.storyPoints}pt
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {data.analytics && data.analytics.spilloverStoryPoints > 0 && (
                                                <div className="flex items-center gap-3 bg-amber-400/5 border border-amber-400/10 rounded-2xl p-4">
                                                    <RotateCcw size={16} className="text-amber-400/60 flex-shrink-0" />
                                                    <p className="text-sm text-white/50">
                                                        <span className="font-bold text-amber-400">{data.analytics.spilloverStoryPoints} story points</span> were spilled over from this sprint.
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

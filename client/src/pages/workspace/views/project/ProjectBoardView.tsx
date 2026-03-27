import { Plus, MoreHorizontal } from 'lucide-react';
import type { Project } from '../../types/sidebar.types';

interface ProjectBoardViewProps {
    project: Project;
}

interface BoardCard {
    id: string;
    title: string;
    tag: string;
    tagColor: string;
    assignee: string;
    priority: 'High' | 'Medium' | 'Low';
}

interface Column {
    id: string;
    label: string;
    count: number;
    cards: BoardCard[];
    accent: string;
}

const priorityDot: Record<string, string> = {
    High: 'bg-rose-500',
    Medium: 'bg-amber-400',
    Low: 'bg-emerald-400',
};

const COLUMNS: Column[] = [
    {
        id: 'todo',
        label: 'To Do',
        count: 3,
        accent: 'bg-white/20',
        cards: [
            { id: 'PF-248', title: 'OAuth with GitHub', tag: 'Feature', tagColor: '#576CBC', assignee: '--', priority: 'High' },
            { id: 'PF-247', title: 'Keyboard shortcuts', tag: 'Enhancement', tagColor: '#7C9AC7', assignee: 'SM', priority: 'Medium' },
            { id: 'PF-246', title: 'Dark mode fixes', tag: 'Bug', tagColor: '#576CBC', assignee: '--', priority: 'Low' },
        ],
    },
    {
        id: 'in-progress',
        label: 'In Progress',
        count: 2,
        accent: 'bg-[#A5D7E8]',
        cards: [
            { id: 'PF-245', title: 'Fix sidebar animation', tag: 'Bug', tagColor: '#576CBC', assignee: 'JD', priority: 'High' },
            { id: 'PF-243', title: 'API rate limiting', tag: 'Task', tagColor: '#7C9AC7', assignee: 'AK', priority: 'High' },
        ],
    },
    {
        id: 'done',
        label: 'Done',
        count: 2,
        accent: 'bg-emerald-400',
        cards: [
            { id: 'PF-242', title: 'Profile avatar upload', tag: 'Feature', tagColor: '#576CBC', assignee: 'LT', priority: 'Medium' },
            { id: 'PF-241', title: 'Email verification flow', tag: 'Task', tagColor: '#7C9AC7', assignee: 'SM', priority: 'Low' },
        ],
    },
];

const BoardCard = ({ card }: { card: BoardCard }) => (
    <div className="bg-white/[0.05] rounded-xl p-4 hover:bg-white/[0.08] transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
            <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${card.tagColor}20`, color: card.tagColor }}
            >
                {card.tag}
            </span>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white/60">
                <MoreHorizontal size={14} />
            </button>
        </div>
        <p className="text-sm text-white/80 font-medium mb-3 leading-snug">{card.title}</p>
        <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/20">{card.id}</span>
            <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[card.priority]}`} />
                <div className="w-6 h-6 rounded-full bg-[#19376D] flex items-center justify-center text-[9px] font-black text-[#A5D7E8]">
                    {card.assignee}
                </div>
            </div>
        </div>
    </div>
);

export const ProjectBoardView = ({ project }: ProjectBoardViewProps) => (
    <div className="space-y-5">
        <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Board</h1>
            <p className="text-[#576CBC]/50 text-sm font-medium mt-0.5">{project.name} · Kanban view</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {COLUMNS.map(col => (
                <div key={col.id} className="bg-white/[0.025] rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${col.accent}`} />
                            <span className="text-sm font-bold text-white/70">{col.label}</span>
                            <span className="text-xs font-bold text-white/20 bg-white/5 rounded-full px-1.5 py-0.5">
                                {col.count}
                            </span>
                        </div>
                        <button className="text-white/20 hover:text-white transition-colors">
                            <Plus size={14} />
                        </button>
                    </div>

                    <div className="p-3 space-y-2.5">
                        {col.cards.map(card => (
                            <BoardCard key={card.id} card={card} />
                        ))}
                        <button className="w-full flex items-center gap-2 py-2 px-3 text-sm text-white/20 hover:text-white/40 hover:bg-white/[0.02] rounded-xl transition-all">
                            <Plus size={13} />
                            Add card
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

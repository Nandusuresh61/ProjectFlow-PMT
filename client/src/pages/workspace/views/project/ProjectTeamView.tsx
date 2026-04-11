import { UserPlus } from 'lucide-react';
import type { Project } from '../../types/sidebar.types';

interface ProjectTeamViewProps {
    project: Project;
    openInvite: () => void;
    canManage: boolean;
}

interface TeamMember {
    initials: string;
    name: string;
    role: string;
    color: string;
    tasks: number;
    status: 'online' | 'away' | 'offline';
}

const PROJECT_MEMBERS: TeamMember[] = [
    { initials: 'JD', name: 'James Doe', role: 'Lead Developer', color: '#A5D7E8', tasks: 5, status: 'online' },
    { initials: 'SM', name: 'Sarah Miller', role: 'Designer', color: '#7C9AC7', tasks: 3, status: 'online' },
    { initials: 'AK', name: 'Alex Kumar', role: 'Backend Engineer', color: '#576CBC', tasks: 4, status: 'away' },
    { initials: 'LT', name: 'Lisa Thompson', role: 'Product Manager', color: '#A5D7E8', tasks: 2, status: 'offline' },
];

const statusDot: Record<string, string> = {
    online: 'bg-emerald-400',
    away: 'bg-amber-400',
    offline: 'bg-white/20',
};

export const ProjectTeamView = ({ project, openInvite, canManage }: ProjectTeamViewProps) => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Team</h1>
                <p className="text-[#576CBC]/50 text-sm font-medium mt-0.5">{project.name} · {PROJECT_MEMBERS.length} members</p>
            </div>
            {canManage && (
                <button
                    onClick={openInvite}
                    className="flex items-center gap-2 px-4 py-2 bg-[#A5D7E8] text-[#060d1a] text-sm font-bold rounded-xl hover:bg-white transition-all"
                >
                    <UserPlus size={15} />
                    Invite
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {PROJECT_MEMBERS.map(member => (
                <div
                    key={member.initials}
                    className="bg-white/[0.025] rounded-2xl p-5 hover:bg-white/[0.04] transition-all"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="relative">
                            <div
                                className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-black text-[#060d1a]"
                                style={{ backgroundColor: member.color }}
                            >
                                {member.initials}
                            </div>
                            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#060d1a] ${statusDot[member.status]}`} />
                        </div>
                    </div>
                    <p className="text-base font-bold text-white mb-0.5">{member.name}</p>
                    <p className="text-xs text-[#576CBC]/50 font-medium mb-4">{member.role}</p>
                    <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
                        <span className="text-xs text-white/25 font-medium">{member.tasks} active tasks</span>
                        <span className="text-xs font-bold capitalize text-white/30">{member.status}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

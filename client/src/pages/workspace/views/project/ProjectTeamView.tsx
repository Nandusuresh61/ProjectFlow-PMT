import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { Project } from '../../types/sidebar.types';
import { getProjectMembers, type ProjectMember } from '@/services/project/project.api';

interface ProjectTeamViewProps {
    project: Project;
}

const statusDot: Record<string, string> = {
    online: 'bg-emerald-400',
    away: 'bg-amber-400',
    offline: 'bg-white/20',
};

const AVATAR_COLORS = [
    '#A5D7E8', // Light Blue
    '#7C9AC7', // Muted Blue
    '#576CBC', // Dark Blue
    '#A5C9CA', // Tealish
    '#E94560', // Red/Pink
    '#FFD369', // Yellow
];

const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const ProjectTeamView = ({ project }: ProjectTeamViewProps) => {
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);
                const response = await getProjectMembers(project.id);
                if (response.success && response.data) {
                    setMembers(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch project members:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [project.id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="w-8 h-8 text-[#A5D7E8] animate-spin" />
                <p className="text-white/50 text-sm font-medium">Loading team...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Team</h1>
                    <p className="text-[#576CBC]/50 text-sm font-medium mt-0.5">
                        {project.name} · {members.length} members
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {members.map(member => {
                    const initials = getInitials(member.fullName);
                    const color = getAvatarColor(member.fullName);
                    
                    return (
                        <div
                            key={member.userId}
                            className="bg-white/[0.025] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="relative">
                                    {member.profileImage ? (
                                        <img 
                                            src={member.profileImage} 
                                            alt={member.fullName}
                                            className="w-11 h-11 rounded-full object-cover border border-white/10"
                                        />
                                    ) : (
                                        <div
                                            className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-black text-[#060d1a]"
                                            style={{ backgroundColor: color }}
                                        >
                                            {initials}
                                        </div>
                                    )}
                                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#060d1a] ${statusDot[member.status] || statusDot.offline}`} />
                                </div>
                            </div>
                            <p className="text-base font-bold text-white mb-0.5 truncate">{member.fullName}</p>
                            <p className="text-xs text-[#576CBC]/50 font-medium mb-4 capitalize">
                                {member.role.toLowerCase().replace('_', ' ')}
                            </p>
                            <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
                                <span className="text-xs text-white/25 font-medium">{member.activeTasksCount} active tasks</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-white/20 group-hover:text-white/40 transition-colors">
                                    {member.status}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {members.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/[0.01] border border-dashed border-white/10 rounded-3xl">
                        <p className="text-white/30 text-sm font-medium">No team members found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

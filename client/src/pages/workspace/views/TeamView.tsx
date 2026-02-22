import { UserPlus, Search, Share2 } from 'lucide-react';
import { Card, Badge } from '../components/BaseComponents';

interface Member {
    name: string;
    email: string;
    role: 'Admin' | 'Member' | 'Viewer';
    status: 'active' | 'inactive';
    projects: number;
    avatar: string;
}

interface TeamViewProps {
    openInvite: () => void;
}

export const TeamView = ({ openInvite }: TeamViewProps) => {
    const members: Member[] = [
        { name: 'John Doe', email: 'john@projectflow.com', role: 'Admin', status: 'active', projects: 5, avatar: 'JD' },
        { name: 'Sarah Miller', email: 'sarah@projectflow.com', role: 'Member', status: 'active', projects: 3, avatar: 'SM' },
        { name: 'Alex Kumar', email: 'alex@projectflow.com', role: 'Member', status: 'active', projects: 4, avatar: 'AK' },
        { name: 'Lisa Thompson', email: 'lisa@projectflow.com', role: 'Member', status: 'active', projects: 2, avatar: 'LT' },
        { name: 'Mike Chen', email: 'mike@projectflow.com', role: 'Viewer', status: 'inactive', projects: 1, avatar: 'MC' },
        { name: 'Emma Wilson', email: 'emma@projectflow.com', role: 'Member', status: 'active', projects: 3, avatar: 'EW' },
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Team Members</h1>
                    <p className="text-[#576CBC]/60 font-medium tracking-tight">Manage team members and their roles</p>
                </div>
                <button
                    onClick={openInvite}
                    className="flex items-center gap-2 bg-[#A5D7E8] text-[#0B2447] px-6 py-3 rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(165,215,232,0.3)] hover:bg-white transition-all"
                >
                    <UserPlus size={18} />
                    <span>Invite Member</span>
                </button>
            </div>

            <div className="relative mb-8 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#576CBC]/40" size={18} />
                <input
                    type="text"
                    placeholder="Search members..."
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:bg-white/[0.08] transition-all focus:border-[#A5D7E8]/20"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member, i) => (
                    <Card key={i} delay={i * 0.05} className="!p-8 !rounded-[2.5rem] !bg-white/[0.03] !border-white/5 relative group">
                        <button className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors">
                            <Share2 size={20} />
                        </button>

                        <div className="flex items-center gap-5 mb-6">
                            <div className="w-14 h-14 bg-[#19376D] rounded-full flex items-center justify-center text-sm font-black text-[#A5D7E8]">
                                {member.avatar}
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white tracking-tight">{member.name}</h4>
                                <p className="text-xs text-[#576CBC]/40 font-medium">{member.email}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mb-8">
                            <Badge variant={member.role === 'Admin' ? 'admin' : 'info'}>{member.role}</Badge>
                            <Badge variant={member.status === 'active' ? 'success' : 'warning'}>{member.status}</Badge>
                        </div>

                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <span className="text-xs font-medium text-[#576CBC]/60">Working on {member.projects} projects</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};


import { MessageSquare, Search, Send } from 'lucide-react';

interface Conversation {
    id: string;
    name: string;
    initials: string;
    color: string;
    preview: string;
    time: string;
    unread?: number;
}

const CONVERSATIONS: Conversation[] = [
    { id: '1', name: 'James Doe', initials: 'JD', color: '#A5D7E8', preview: 'Can you review the latest sprint plan?', time: '2m', unread: 3 },
    { id: '2', name: 'Sarah Miller', initials: 'SM', color: '#7C9AC7', preview: 'Updated the board tasks ✓', time: '15m' },
    { id: '3', name: 'Design Team', initials: 'DT', color: '#576CBC', preview: 'Alex: Figma files are ready', time: '1h', unread: 1 },
    { id: '4', name: 'Lisa Thompson', initials: 'LT', color: '#A5D7E8', preview: 'Sprint 12 officially started!', time: '2h' },
    { id: '5', name: 'Alex Kumar', initials: 'AK', color: '#7C9AC7', preview: 'Closing PF-228 today', time: '3h' },
];

export const ChatView = () => (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Inbox</h1>
            <p className="text-[#576CBC]/50 text-sm font-medium mt-1">Messages and team conversations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-220px)] min-h-[500px]">
            {/* Conversation list */}
            <div className="bg-white/[0.025] rounded-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-white/[0.05]">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-white/[0.04] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-white/[0.07] transition-colors"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {CONVERSATIONS.map((conv, i) => (
                        <button
                            key={conv.id}
                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left border-b border-white/[0.03] ${i === 0 ? 'bg-white/[0.04]' : ''}`}
                        >
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black text-[#060d1a] flex-shrink-0"
                                style={{ backgroundColor: conv.color }}
                            >
                                {conv.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-sm font-semibold text-white truncate">{conv.name}</span>
                                    <span className="text-xs text-white/30 ml-2 flex-shrink-0">{conv.time}</span>
                                </div>
                                <p className="text-xs text-white/40 truncate">{conv.preview}</p>
                            </div>
                            {conv.unread && (
                                <span className="w-4 h-4 rounded-full bg-[#A5D7E8] text-[#060d1a] text-[9px] font-black flex items-center justify-center flex-shrink-0">
                                    {conv.unread}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Message area */}
            <div className="lg:col-span-2 bg-white/[0.025] rounded-2xl flex flex-col overflow-hidden">
                {/* Chat header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.05]">
                    <div className="w-8 h-8 rounded-full bg-[#A5D7E8] flex items-center justify-center text-[10px] font-black text-[#060d1a]">
                        JD
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">James Doe</p>
                        <p className="text-xs text-emerald-400 font-medium">Online</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-5 space-y-4 overflow-y-auto custom-scrollbar">
                    {[
                        { from: 'them', text: 'Can you review the latest sprint plan?', time: '2:30 PM' },
                        { from: 'me', text: "Sure, I'll take a look now.", time: '2:31 PM' },
                        { from: 'them', text: "Also check the board — I've moved a few tasks.", time: '2:32 PM' },
                    ].map((msg, i) => (
                        <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${msg.from === 'me'
                                ? 'bg-[#A5D7E8] text-[#060d1a] font-medium rounded-br-md'
                                : 'bg-white/[0.06] text-white/80 rounded-bl-md'
                                }`}>
                                <p>{msg.text}</p>
                                <p className={`text-[10px] mt-1 ${msg.from === 'me' ? 'text-[#060d1a]/50' : 'text-white/25'}`}>{msg.time}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/[0.05]">
                    <div className="flex items-center gap-3 bg-white/[0.04] rounded-xl px-4 py-2.5">
                        <MessageSquare size={15} className="text-white/20 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Write a message..."
                            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none"
                        />
                        <button className="p-1.5 rounded-lg bg-[#A5D7E8]/10 text-[#A5D7E8] hover:bg-[#A5D7E8]/20 transition-colors">
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

import React, { useEffect, useState, useRef } from 'react';
import { MessageSquare, Search, Send, Hash, Users } from 'lucide-react';
import { useSocket } from '@/app/Providers/SocketProvider';
import { useWorkspaceStore } from '@/store/workspace.store';
import { getWorkspaceProjects } from '@/services/project/project.api';
import { getChatMessages } from '@/services/chat/chat.api';
import type { Message } from '@/services/chat/chat.api';
import { AuthUserState } from '@/store/auth.store';
import { format } from 'date-fns';

interface Conversation {
    id: string;
    name: string;
    type: 'workspace' | 'project';
    initials: string;
    color: string;
    unread?: number;
}

export const ChatView = () => {
    const { socket } = useSocket();
    const { currentWorkspace } = useWorkspaceStore();
    const { user } = AuthUserState();
    
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Debounce search term
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load conversations (Workspace + Projects)
    useEffect(() => {
        const loadConversations = async () => {
            if (!currentWorkspace) return;

            const workspaceConv: Conversation = {
                id: currentWorkspace.workspaceId,
                name: `${currentWorkspace.name} (General)`,
                type: 'workspace',
                initials: currentWorkspace.name.substring(0, 2).toUpperCase(),
                color: '#576CBC',
            };

            try {
                const response = await getWorkspaceProjects(currentWorkspace.workspaceId);
                const projectConvs: Conversation[] = (response.data || []).map(p => ({
                    id: p.projectId,
                    name: p.name,
                    type: 'project',
                    initials: p.name.substring(0, 2).toUpperCase(),
                    color: '#7C9AC7',
                }));

                setConversations([workspaceConv, ...projectConvs]);
                
                // Select first room by default if none selected
                if (!selectedRoomId) {
                    setSelectedRoomId(workspaceConv.id);
                }
            } catch (error) {
                console.error("Failed to load projects", error);
                setConversations([workspaceConv]);
            }
        };

        loadConversations();
    }, [currentWorkspace]);

    // Handle room joining and message history
    useEffect(() => {
        if (!socket || !selectedRoomId) return;

        // Join room
        socket.emit('join_room', selectedRoomId);

        // Fetch history
        const fetchHistory = async () => {
            setIsLoadingMessages(true);
            try {
                const response = await getChatMessages(selectedRoomId);
                if (response.success && response.data) {
                    setMessages(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        fetchHistory();

        // Handle reconnection
        const onConnect = () => {
            console.log("Socket reconnected, joining room:", selectedRoomId);
            socket.emit('join_room', selectedRoomId);
        };

        socket.on('connect', onConnect);

        // Listen for new messages
        const handleNewMessage = (msg: Message) => {
            console.log("New message received:", msg);
            if (msg.roomId === selectedRoomId) {
                setMessages(prev => [...prev, msg]);
            }
        };

        socket.on('new_message', handleNewMessage);
        socket.on('error', (err) => console.error("Socket error:", err));

        // Handle typing events
        const handleUserTyping = (data: { userId: string; fullName: string; isTyping: boolean }) => {
            if (data.userId === user?.userId) return;
            setTypingUsers(prev => {
                const newState = { ...prev };
                if (data.isTyping) {
                    newState[data.userId] = data.fullName;
                } else {
                    delete newState[data.userId];
                }
                return newState;
            });
        };

        socket.on('user_typing', handleUserTyping);

        return () => {
            console.log("Leaving room:", selectedRoomId);
            socket.emit('leave_room', selectedRoomId);
            socket.off('connect', onConnect);
            socket.off('new_message', handleNewMessage);
            socket.off('user_typing', handleUserTyping);
            socket.off('error');
            setTypingUsers({});
        };
    }, [socket, selectedRoomId]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!socket || !selectedRoomId || !inputValue.trim()) return;

        // Stop typing immediately when sending
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        socket.emit('typing', { roomId: selectedRoomId, isTyping: false });

        socket.emit('send_message', {
            roomId: selectedRoomId,
            content: inputValue.trim(),
            type: 'TEXT'
        });

        setInputValue('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (!socket || !selectedRoomId) return;

        // Emit typing true
        socket.emit('typing', { roomId: selectedRoomId, isTyping: true });

        // Clear existing timeout
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // Set timeout to stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing', { roomId: selectedRoomId, isTyping: false });
        }, 2000);
    };

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const selectedConv = conversations.find(c => c.id === selectedRoomId);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Inbox</h1>
                <p className="text-[#576CBC]/50 text-sm font-medium mt-1">Real-time team collaboration</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-220px)] min-h-[500px]">
                {/* Conversation list */}
                <div className="bg-white/[0.025] rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/[0.05]">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                            <input
                                type="text"
                                placeholder="Search channels..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/[0.04] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-white/[0.07] transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {filteredConversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setSelectedRoomId(conv.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left border-b border-white/[0.03] ${selectedRoomId === conv.id ? 'bg-white/[0.04]' : ''}`}
                            >
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black text-[#060d1a] flex-shrink-0"
                                    style={{ backgroundColor: conv.color }}
                                >
                                    {conv.type === 'workspace' ? <Users size={14} /> : <Hash size={14} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span className="text-sm font-semibold text-white truncate">{conv.name}</span>
                                    </div>
                                    <p className="text-xs text-white/40 truncate">{conv.type === 'workspace' ? 'General Channel' : 'Project Channel'}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Message area */}
                <div className="lg:col-span-2 bg-white/[0.025] rounded-2xl flex flex-col overflow-hidden">
                    {/* Chat header */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.05]">
                        <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-[#060d1a]"
                            style={{ backgroundColor: selectedConv?.color || '#A5D7E8' }}
                        >
                            {selectedConv?.initials || '??'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">{selectedConv?.name || 'Select a chat'}</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-5 space-y-4 overflow-y-auto custom-scrollbar">
                        {isLoadingMessages ? (
                            <div className="h-full flex items-center justify-center text-white/20 text-sm">Loading messages...</div>
                        ) : messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-white/10 space-y-2">
                                <MessageSquare size={40} />
                                <p>No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.messageId} className={`flex ${msg.senderId === user?.userId ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${msg.senderId === user?.userId
                                        ? 'bg-[#A5D7E8] text-[#060d1a] font-medium rounded-br-md'
                                        : 'bg-white/[0.06] text-white/80 rounded-bl-md'
                                        }`}>
                                        {msg.senderId !== user?.userId && (
                                            <p className="text-[10px] font-bold mb-1 opacity-50 uppercase tracking-wider">{msg.senderName || 'Member'}</p>
                                        )}
                                        <p>{msg.content}</p>
                                        <p className={`text-[10px] mt-1 ${msg.senderId === user?.userId ? 'text-[#060d1a]/50' : 'text-white/25'}`}>
                                            {format(new Date(msg.createdAt), 'h:mm a')}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        {Object.keys(typingUsers).length > 0 && (
                            <div className="flex items-center gap-2 px-2 py-1">
                                <div className="flex gap-1">
                                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                                <span className="text-[10px] text-[#576CBC]/60 font-medium italic">
                                    {Object.values(typingUsers).join(", ")} {Object.keys(typingUsers).length > 1 ? 'are typing...' : 'is typing...'}
                                </span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/[0.05]">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-white/[0.04] rounded-xl px-4 py-2.5">
                            <MessageSquare size={15} className="text-white/20 flex-shrink-0" />
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder="Write a message..."
                                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none"
                            />
                            <button 
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="p-1.5 rounded-lg bg-[#A5D7E8]/10 text-[#A5D7E8] hover:bg-[#A5D7E8]/20 transition-colors disabled:opacity-30"
                            >
                                <Send size={14} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

import React, { useEffect, useState, useRef } from 'react';
import { MessageSquare, Search, Send, Hash, Users, Smile, Paperclip, Loader2 } from 'lucide-react';
import { useSocket } from '@/app/Providers/SocketProvider';
import { useWorkspaceStore } from '@/store/workspace.store';
import { getChatMessages, getChatConversations, type Message, type Conversation } from '@/services/chat/chat.api';
import { AuthUserState } from '@/store/auth.store';
import { format, isToday } from 'date-fns';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { toast } from 'sonner';

const COMMON_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "👏", "🎉", "✅", "🚀", "👀", "💯"];

interface UIConversation extends Conversation {
    initials: string;
    color: string;
    unread?: number;
}

export const ChatView = () => {
    const { socket } = useSocket();
    const { currentWorkspace } = useWorkspaceStore();
    const { user } = AuthUserState();
    
    const [conversations, setConversations] = useState<UIConversation[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isLoadingConversations, setIsLoadingConversations] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Load conversations
    useEffect(() => {
        const loadConversations = async () => {
            if (!currentWorkspace) return;
            setIsLoadingConversations(true);
            try {
                const response = await getChatConversations(currentWorkspace.workspaceId);
                if (response.success && response.data) {
                    const uiConvs: UIConversation[] = response.data.map((c) => ({
                        ...c,
                        initials: c.name.substring(0, 2).toUpperCase(),
                        color: c.type === 'workspace' ? '#576CBC' : '#7C9AC7',
                    }));
                    setConversations(uiConvs);
                    
                    if (!selectedRoomId && uiConvs.length > 0) {
                        setSelectedRoomId(uiConvs[0].id);
                    }
                }
            } catch (error) {
                console.error("Failed to load conversations", error);
            } finally {
                setIsLoadingConversations(false);
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
            socket.emit('join_room', selectedRoomId);
        };

        socket.on('connect', onConnect);

        // Listen for new messages
        const handleNewMessage = (msg: Message) => {
            if (msg.roomId === selectedRoomId) {
                setMessages(prev => [...prev, msg]);
            }

            // Update conversation list in real-time
            setConversations(prev => {
                const index = prev.findIndex(c => c.id === msg.roomId);
                if (index !== -1) {
                    const updated = [...prev];
                    const [conv] = updated.splice(index, 1);
                    conv.lastMessage = msg;
                    return [conv, ...updated]; // Move to top
                }
                return prev;
            });
        };

        socket.on('new_message', handleNewMessage);

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
            socket.emit('leave_room', selectedRoomId);
            socket.off('connect', onConnect);
            socket.off('new_message', handleNewMessage);
            socket.off('user_typing', handleUserTyping);
            setTypingUsers({});
        };
    }, [socket, selectedRoomId]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!socket || !selectedRoomId || !inputValue.trim()) return;

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

        socket.emit('typing', { roomId: selectedRoomId, isTyping: true });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing', { roomId: selectedRoomId, isTyping: false });
        }, 2000);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !socket || !selectedRoomId) return;

        try {
            setIsUploading(true);
            const url = await uploadToCloudinary(file);
            socket.emit('send_message', {
                roomId: selectedRoomId,
                content: url,
                type: 'IMAGE'
            });
            toast.success("Image sent");
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const insertEmoji = (emoji: string) => {
        setInputValue(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const formatMessageTime = (date: string) => {
        const d = new Date(date);
        if (isToday(d)) {
            return format(d, 'h:mm a');
        }
        return format(d, 'MMM d');
    };

    const renderMessageContent = (msg: Message) => {
        if (msg.type === 'IMAGE') {
            return (
                <a href={msg.content} target="_blank" rel="noopener noreferrer" className="block mt-1">
                    <img src={msg.content} alt="shared image" className="max-w-full rounded-lg border border-white/10 shadow-lg" />
                </a>
            );
        }

        // Link detection
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = msg.content.split(urlRegex);

        return (
            <p className="whitespace-pre-wrap break-words">
                {parts.map((part, i) => (
                    urlRegex.test(part) ? (
                        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                            {part}
                        </a>
                    ) : part
                ))}
            </p>
        );
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
                        {isLoadingConversations ? (
                           <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-white/20" /></div>
                        ) : filteredConversations.length === 0 ? (
                            <p className="p-4 text-center text-white/20 text-xs">No conversations found</p>
                        ) : filteredConversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setSelectedRoomId(conv.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left border-b border-white/[0.03] ${selectedRoomId === conv.id ? 'bg-white/[0.04]' : ''}`}
                            >
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black text-[#060d1a] flex-shrink-0"
                                    style={{ backgroundColor: conv.color }}
                                >
                                    {conv.type === 'workspace' ? <Users size={16} /> : <Hash size={16} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span className="text-sm font-semibold text-white truncate">{conv.name}</span>
                                        {conv.lastMessage && (
                                            <span className="text-[10px] text-white/30 whitespace-nowrap ml-2">
                                                {formatMessageTime(conv.lastMessage.createdAt)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-white/40 truncate">
                                            {conv.lastMessage 
                                                ? (
                                                    <>
                                                        <span className="font-semibold text-white/50">
                                                            {conv.lastMessage.senderId === user?.userId ? 'You' : (conv.lastMessage.senderName?.split(' ')[0] || 'Member')}:
                                                        </span>{' '}
                                                        {conv.lastMessage.type === 'IMAGE' ? 'Sent an image' : conv.lastMessage.content}
                                                    </>
                                                  )
                                                : (conv.type === 'workspace' ? 'General Channel' : 'Project Channel')
                                            }
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Message area */}
                <div className="lg:col-span-2 bg-white/[0.025] rounded-2xl flex flex-col overflow-hidden relative">
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
                            <div className="h-full flex items-center justify-center text-white/20 text-sm">
                                <Loader2 className="animate-spin mr-2" size={16} /> Loading messages...
                            </div>
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
                                        {renderMessageContent(msg)}
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
                    <div className="p-4 border-t border-white/[0.05] bg-[#060d1a]/20">
                        {showEmojiPicker && (
                            <div className="absolute bottom-20 left-4 p-3 bg-[#0B2447] border border-[#576CBC]/30 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
                                <div className="grid grid-cols-4 gap-2">
                                    {COMMON_EMOJIS.map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => insertEmoji(emoji)}
                                            className="text-xl p-2 hover:bg-white/5 rounded-lg transition-all"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-4 py-2">
                            <button 
                                type="button"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={`p-1.5 rounded-lg transition-colors ${showEmojiPicker ? 'bg-white/10 text-[#A5D7E8]' : 'text-white/20 hover:text-white/40'}`}
                            >
                                <Smile size={18} />
                            </button>
                            <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="p-1.5 rounded-lg text-white/20 hover:text-white/40 transition-colors disabled:opacity-30"
                            >
                                {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                                accept="image/*" 
                            />
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder="Write a message..."
                                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none py-2"
                            />
                            <button 
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="p-2 rounded-lg bg-[#A5D7E8] text-[#060d1a] hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

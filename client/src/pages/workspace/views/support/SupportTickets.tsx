import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Plus, Search, MessageSquare, Clock, ChevronRight, Loader2, Paperclip, X, Send, ArrowLeft, User as UserIcon, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getWorkspaceTickets, getTicketDetails, createTicket, replyToTicket, type Ticket, type TicketMessage, TicketStatus, TicketPriority } from "@/services/ticket/ticket.api";
import { useWorkspaceStore } from "@/store/workspace.store";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { uploadToCloudinary } from "@/lib/cloudinary";

export function SupportTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);

  const fetchTickets = async () => {
    if (!currentWorkspace) return;
    try {
      setIsLoading(true);
      const response = await getWorkspaceTickets(currentWorkspace.workspaceId);
      if (response.success) {
        setTickets(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      toast.error("Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [currentWorkspace]);

  const filteredTickets = tickets.filter(ticket => 
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedTicketId) {
    return (
      <TicketDetailView 
        ticketId={selectedTicketId} 
        onBack={() => {
            setSelectedTicketId(null);
            fetchTickets();
        }} 
      />
    );
  }

  return (
    <div className="p-6 space-y-6 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Support Tickets</h2>
          <p className="text-[#576CBC]/60 text-sm font-medium">Get help with billing, features, or workspace issues</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#A5D7E8] text-[#0B2447] font-bold text-sm rounded-2xl hover:bg-white hover:shadow-[0_0_20px_rgba(165,215,232,0.3)] transition-all shrink-0"
        >
          <Plus size={18} strokeWidth={3} />
          Create New Ticket
        </button>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#576CBC]/40 group-focus-within:text-[#A5D7E8] transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search tickets by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-[#A5D7E8]/30 focus:bg-white/[0.08] transition-all"
        />
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-400px)] pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-[#A5D7E8] animate-spin" />
            <p className="text-[#576CBC]/60 font-bold uppercase tracking-widest text-[10px]">Loading your tickets...</p>
          </div>
        ) : filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <motion.div
              key={ticket.ticketId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedTicketId(ticket.ticketId)}
              className="group relative flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-[#A5D7E8]/20 transition-all cursor-pointer overflow-hidden"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-bold truncate group-hover:text-[#A5D7E8] transition-colors">{ticket.title}</h3>
                  <StatusBadge status={ticket.status} />
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2 text-[#576CBC]/60 text-xs font-bold uppercase tracking-wider">
                    <Clock size={14} />
                    Last Activity {formatDistanceToNow(new Date(ticket.lastReplyAt), { addSuffix: true })}
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#576CBC]/40 group-hover:bg-[#A5D7E8]/10 group-hover:text-[#A5D7E8] transition-all">
                  <ChevronRight size={20} />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01]">
            <div className="w-20 h-20 bg-white/5 rounded-[30px] flex items-center justify-center mb-6 text-[#576CBC]/30">
              <MessageSquare size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No tickets found</h3>
            <p className="text-[#576CBC]/60 text-sm max-w-[300px] text-center">
              {searchQuery ? "Try searching with different terms" : "You haven't created any support tickets yet."}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <CreateTicketModal 
            onClose={() => setShowCreateModal(false)} 
            onSuccess={() => {
              setShowCreateModal(false);
              fetchTickets();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }: { status: TicketStatus }) {
  const styles = {
    [TicketStatus.OPEN]: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    [TicketStatus.IN_PROGRESS]: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    [TicketStatus.RESOLVED]: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    [TicketStatus.CLOSED]: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const styles = {
    [TicketPriority.HIGH]: "text-red-400",
    [TicketPriority.MEDIUM]: "text-amber-400",
    [TicketPriority.LOW]: "text-blue-400",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full bg-current ${styles[priority]}`} />
      <span className={`text-[10px] font-black uppercase tracking-widest ${styles[priority]}`}>
        {priority} Priority
      </span>
    </div>
  );
}

interface TicketDetailViewProps {
  ticketId: string;
  onBack: () => void;
}

function TicketDetailView({ ticketId, onBack }: TicketDetailViewProps) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const response = await getTicketDetails(ticketId);
      if (response.success) {
        setTicket(response.data.ticket);
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Failed to fetch details:", error);
      toast.error("Failed to load ticket details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [ticketId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const urls = await Promise.all(uploadPromises);
      setAttachments(prev => [...prev, ...urls]);
      toast.success("Files uploaded successfully");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      setIsSubmitting(true);
      const response = await replyToTicket(ticketId, {
        message: newMessage.trim(),
        attachments,
      });

      if (response.success) {
        setNewMessage("");
        setAttachments([]);
        fetchDetails(); // Refresh messages
      }
    } catch (error) {
      toast.error("Failed to send reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 text-[#A5D7E8] animate-spin" />
        <p className="text-[#576CBC]/60 font-bold uppercase tracking-widest text-[10px]">Loading conversation...</p>
      </div>
    );
  }

  if (!ticket) return null;

  const isClosed = ticket.status === TicketStatus.CLOSED;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white/[0.01] rounded-3xl">
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#576CBC] hover:bg-white/10 hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-black text-white truncate tracking-tight">{ticket.title}</h3>
            <StatusBadge status={ticket.status} />
          </div>
          <div className="flex items-center gap-4 mt-1">
             <p className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Clock size={12} />
                Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
             </p>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar max-h-[500px]"
      >
        {messages.map((msg, idx) => {
          const isUser = msg.senderId === ticket.createdBy;
          return (
            <motion.div
              key={msg.messageId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${
                  isUser 
                    ? "bg-[#19376D] border-[#576CBC]/20 text-[#A5D7E8]" 
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(165,215,232,0.1)]"
                }`}>
                  {isUser ? <UserIcon size={20} /> : <ShieldCheck size={20} />}
                </div>
              </div>
              <div className={`flex flex-col max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#576CBC]/60">
                    {isUser ? "You" : (msg.senderName || "Support Team")}
                  </span>
                  <span className="text-[10px] font-bold text-[#576CBC]/40 tracking-wider">
                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                  isUser 
                    ? "bg-white/[0.03] border border-white/5 text-white/90 rounded-tr-none" 
                    : "bg-[#A5D7E8]/10 border border-[#A5D7E8]/20 text-white rounded-tl-none shadow-lg"
                }`}>
                  {msg.message}
                  
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.attachments.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block group/att">
                          <img 
                            src={url} 
                            alt="attachment" 
                            className="max-w-[200px] max-h-[200px] rounded-xl border border-white/10 group-hover/att:border-[#A5D7E8]/50 transition-all shadow-xl" 
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {!isClosed ? (
        <div className="p-6 bg-white/[0.02] border-t border-white/5">
          <form onSubmit={handleReply} className="space-y-4">
            {(attachments.length > 0 || isUploading) && (
              <div className="flex flex-wrap gap-2 p-2 bg-white/[0.02] border border-white/5 rounded-2xl">
                {attachments.map((url, idx) => (
                  <div key={idx} className="relative group/pre w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                    <img src={url} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover/pre:opacity-100 transition-all text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {isUploading && (
                  <div className="w-12 h-12 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center bg-white/5 animate-pulse">
                    <Loader2 size={16} className="text-[#A5D7E8] animate-spin" />
                  </div>
                )}
              </div>
            )}

            <div className="relative group">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={2}
                className="w-full bg-white/[0.03] border border-white/5 rounded-[24px] px-6 py-4 pr-32 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#A5D7E8]/50 focus:bg-white/[0.06] transition-all resize-none"
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <label className="p-2 rounded-xl bg-white/5 text-[#576CBC] hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                  <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                  <Paperclip size={18} />
                </label>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading || (!newMessage.trim() && attachments.length === 0)}
                  className="p-2 bg-[#A5D7E8] text-[#0B2447] rounded-xl hover:shadow-[0_0_20px_rgba(165,215,232,0.3)] hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} strokeWidth={2.5} />}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex flex-col items-center justify-center gap-2">
          <p className="text-[#576CBC]/60 font-bold text-[10px] uppercase tracking-widest">This ticket is closed.</p>
        </div>
      )}
    </div>
  );
}

function CreateTicketModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const urls = await Promise.all(uploadPromises);
      setAttachments(prev => [...prev, ...urls]);
      toast.success("Files uploaded successfully");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWorkspace || !title.trim() || !message.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await createTicket({
        workspaceId: currentWorkspace.workspaceId,
        title: title.trim(),
        message: message.trim(),
        attachments,
      });

      if (response.success) {
        toast.success("Ticket created successfully");
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to create ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl bg-[#060c16] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 sm:p-10 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">Create Support Ticket</h3>
            <p className="text-[#576CBC]/60 font-medium text-sm mt-1">Our team will get back to you shortly</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/5 rounded-xl text-white/40 transition-all active:scale-95"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#576CBC]/80 uppercase tracking-wider ml-1">Title</label>
              <input
                type="text" 
                required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What can we help you with?"
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#A5D7E8]/30 focus:bg-white/[0.08] transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#576CBC]/80 uppercase tracking-wider ml-1">Description</label>
              <textarea
                required 
                rows={4} 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide as much detail as possible about your issue..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#A5D7E8]/30 focus:bg-white/[0.08] transition-all resize-none"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-[#576CBC]/80 uppercase tracking-wider ml-1">Attachments</label>
              <div className="flex flex-wrap gap-3">
                {attachments.map((url, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={idx} 
                    className="relative group/att w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shadow-lg"
                  >
                    <img src={url} alt="attachment" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover/att:opacity-100 transition-all text-white"
                    >
                      <X size={20} />
                    </button>
                  </motion.div>
                ))}
                
                <label className={`w-20 h-20 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-white/5 hover:border-[#A5D7E8]/30 transition-all active:scale-95 ${isUploading ? 'opacity-50 cursor-wait' : ''}`}>
                  <input type="file" multiple className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                  {isUploading ? (
                      <Loader2 size={20} className="animate-spin text-[#A5D7E8]" />
                  ) : (
                      <>
                          <Paperclip size={20} className="text-[#576CBC]" />
                          <span className="text-[10px] font-bold text-[#576CBC]/60 uppercase">Add</span>
                      </>
                  )}
                </label>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 sm:p-10 border-t border-white/5 flex gap-4 bg-white/[0.01]">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 py-4 text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-white/5"
          >
            Cancel
          </button>
          <button
            onClick={(e) => handleSubmit(e as any)} 
            disabled={isSubmitting || isUploading || !title.trim() || !message.trim()}
            className="flex-1 py-4 text-sm font-bold bg-[#A5D7E8] text-[#0B2447] rounded-2xl shadow-[0_0_20px_rgba(165,215,232,0.2)] hover:shadow-[0_0_25px_rgba(165,215,232,0.3)] hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} strokeWidth={2.5} />
            )}
            Send Ticket
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

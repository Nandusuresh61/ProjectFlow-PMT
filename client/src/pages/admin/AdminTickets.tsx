import { Search, Filter, MessageSquare, Clock, ChevronRight, Loader2, Paperclip, X, Send, ArrowLeft, User as UserIcon, ShieldCheck, CheckCircle2, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllTickets, getTicketDetails, adminReplyToTicket, updateTicketStatus, type Ticket, type TicketMessage, TicketStatus, TicketPriority } from "@/services/ticket/ticket.api";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    page: 1,
    search: "",
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setFilters(prev => ({ ...prev, page: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [filters.search]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const response = await getAllTickets({
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        search: debouncedSearch || undefined,
        page: filters.page,
      });
      if (response.success) {
        setTickets(response.data.tickets);
        setTotal(response.data.total);
      }
    } catch (error) {
      toast.error("Failed to load ticket queue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters.status, filters.priority, filters.page, debouncedSearch]);

  if (selectedTicketId) {
    return (
      <AdminTicketDetailView 
        ticketId={selectedTicketId} 
        onBack={() => {
            setSelectedTicketId(null);
            fetchTickets();
        }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Support Ticket Queue</h1>
          <p className="text-zinc-500 text-sm">Manage and respond to workspace support requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input 
                type="text" 
                placeholder="Search tickets by title..." 
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-green-500/50 transition-all"
            />
        </div>
        <div className="flex gap-2">
            <select 
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-green-500/50 transition-all"
            >
                <option value="">All Statuses</option>
                <option value={TicketStatus.OPEN}>Open</option>
                <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                <option value={TicketStatus.RESOLVED}>Resolved</option>
                <option value={TicketStatus.CLOSED}>Closed</option>
            </select>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Loading queue...</p>
          </div>
        ) : tickets.length > 0 ? (
          <>
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket.ticketId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedTicketId(ticket.ticketId)}
                className="group relative flex items-center gap-4 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-green-500/30 transition-all cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      ticket.priority === TicketPriority.HIGH ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" :
                      ticket.priority === TicketPriority.MEDIUM ? "bg-amber-500" : "bg-blue-500"
                    }`} />
                    <h3 className="text-zinc-200 font-bold truncate group-hover:text-green-500 transition-colors">{ticket.title}</h3>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                      <Clock size={12} />
                      Active {formatDistanceToNow(new Date(ticket.lastReplyAt), { addSuffix: true })}
                    </div>
                    <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                      Workspace: <span className="text-zinc-300">{ticket.workspaceName || ticket.workspaceId}</span>
                    </div>
                    <div className={`text-[10px] font-black uppercase tracking-widest ${
                      ticket.planType === 'ENTERPRISE' ? 'text-purple-400' : 
                      ticket.planType === 'PRO' ? 'text-amber-400' : 'text-zinc-500'
                    }`}>
                      {ticket.planType} PLAN
                    </div>
                  </div>
                </div>
                <ChevronRight className="text-zinc-600 group-hover:text-green-500 transition-all" size={20} />
              </motion.div>
            ))}

            {total > 0 && (
              <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50 mt-4">
                <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                  Showing <span className="text-zinc-300">{(filters.page - 1) * 10 + 1}</span> - <span className="text-zinc-300">{Math.min(filters.page * 10, total)}</span> of <span className="text-zinc-300">{total}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={filters.page === 1}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-green-500">
                    {filters.page} / {Math.ceil(total / 10) || 1}
                  </div>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: Math.min(Math.ceil(total / 10), prev.page + 1) }))}
                    disabled={filters.page >= Math.ceil(total / 10)}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-3xl">
            <MessageSquare size={48} className="text-zinc-700 mb-4" />
            <h3 className="text-white font-bold">Queue is empty</h3>
            <p className="text-zinc-500 text-sm">No tickets matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: TicketStatus }) {
    const styles = {
      [TicketStatus.OPEN]: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      [TicketStatus.IN_PROGRESS]: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      [TicketStatus.RESOLVED]: "bg-green-500/10 text-green-500 border-green-500/20",
      [TicketStatus.CLOSED]: "bg-zinc-800 text-zinc-500 border-zinc-700",
    };
  
    return (
      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${styles[status]}`}>
        {status}
      </span>
    );
}

function AdminTicketDetailView({ ticketId, onBack }: { ticketId: string, onBack: () => void }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
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
      toast.error("Failed to load details");
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

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      setIsSubmitting(true);
      const response = await adminReplyToTicket(ticketId, {
        message: newMessage.trim(),
        attachments,
      });

      if (response.success) {
        setNewMessage("");
        setAttachments([]);
        fetchDetails();
      }
    } catch (error) {
      toast.error("Failed to send reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (status: TicketStatus) => {
    try {
        setIsUpdatingStatus(true);
        const response = await updateTicketStatus(ticketId, status);
        if (response.success) {
            toast.success(`Status updated to ${status}`);
            fetchDetails();
        }
    } catch (error) {
        toast.error("Failed to update status");
    } finally {
        setIsUpdatingStatus(false);
    }
  };

  if (isLoading && !ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Loading conversation...</p>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                <ArrowLeft size={20} />
            </button>
            <div>
                <h3 className="text-white font-bold">{ticket.title}</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Ticket ID: {ticket.ticketId}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <select 
                value={ticket.status}
                disabled={isUpdatingStatus}
                onChange={(e) => handleStatusUpdate(e.target.value as TicketStatus)}
                className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-xs font-bold text-zinc-300 focus:outline-none"
            >
                <option value={TicketStatus.OPEN}>Open</option>
                <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                <option value={TicketStatus.RESOLVED}>Resolved</option>
                <option value={TicketStatus.CLOSED}>Closed</option>
            </select>
            {ticket.status !== TicketStatus.RESOLVED && (
                <button 
                    onClick={() => handleStatusUpdate(TicketStatus.RESOLVED)}
                    className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-all"
                    title="Mark as Resolved"
                >
                    <CheckCircle2 size={20} />
                </button>
            )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-zinc-900/20">
        {messages.map((msg) => {
          const isUser = msg.senderId === ticket.createdBy;
          return (
            <div key={msg.messageId} className={`flex gap-4 ${isUser ? "flex-row" : "flex-row-reverse"}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                isUser ? "bg-zinc-800 border-zinc-700 text-zinc-400" : "bg-green-500/10 border-green-500/20 text-green-500"
              }`}>
                {isUser ? <UserIcon size={20} /> : <ShieldCheck size={20} />}
              </div>
              <div className={`flex flex-col max-w-[75%] ${isUser ? "items-start" : "items-end"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    {isUser ? (msg.senderName || "User") : "Admin (You)"}
                  </span>
                  <span className="text-[10px] text-zinc-600 font-medium">{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}</span>
                </div>
                <div className={`p-4 rounded-2xl text-sm ${
                  isUser ? "bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none" : "bg-green-500/10 border border-green-500/20 text-zinc-100 rounded-tr-none"
                }`}>
                  {msg.message}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {msg.attachments.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block border border-zinc-800 rounded-lg overflow-hidden">
                                <img src={url} alt="att" className="max-w-[150px] max-h-[150px] object-cover" />
                            </a>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply Area */}
      <div className="p-6 border-t border-zinc-800 bg-zinc-900/50">
        <form onSubmit={handleReply} className="relative group">
            <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Reply to user..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 pr-16 text-sm text-white focus:outline-none focus:border-green-500/50 transition-all resize-none"
                rows={2}
            />
            <button
                type="submit"
                disabled={isSubmitting || !newMessage.trim()}
                className="absolute right-3 bottom-3 p-3 bg-green-600 text-white rounded-xl hover:bg-green-500 disabled:opacity-50 transition-all"
            >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
        </form>
      </div>
    </div>
  );
}

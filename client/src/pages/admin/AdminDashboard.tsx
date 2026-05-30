import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Building2,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Mail,
  User,
  Activity
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  getDashboardStats,
  getRevenueOverview,
  getWorkspaceGrowth,
  getRecentWorkspaces,
  getPendingTickets,
  toggleSuspendWorkspace
} from "@/services/superAdmin/superadmin.api";
import { updateTicketStatus, TicketStatus } from "@/services/ticket/ticket.api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import type {
  DashboardStats,
  RevenueOverview,
  WorkspaceGrowth,
  RecentWorkspace,
  PendingTicket
} from "@/types/superadmin.types";

export default function AdminDashboard() {
  // States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenue, setRevenue] = useState<RevenueOverview | null>(null);
  const [growth, setGrowth] = useState<WorkspaceGrowth | null>(null);
  
  const [workspaces, setWorkspaces] = useState<RecentWorkspace[]>([]);
  const [workspaceTotal, setWorkspaceTotal] = useState(0);
  const [workspacePage, setWorkspacePage] = useState(1);
  const [workspacesLoading, setWorkspacesLoading] = useState(true);

  const [tickets, setTickets] = useState<PendingTicket[]>([]);
  const [ticketTotal, setTicketTotal] = useState(0);
  const [ticketPage, setTicketPage] = useState(1);
  const [ticketsLoading, setTicketsLoading] = useState(true);

  const [loading, setLoading] = useState(true);

  // Dialog / Details states
  const [selectedWorkspace, setSelectedWorkspace] = useState<RecentWorkspace | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<PendingTicket | null>(null);
  const [ticketStatusUpdating, setTicketStatusUpdating] = useState(false);
  const [workspaceSuspending, setWorkspaceSuspending] = useState(false);

  // Fetch Dashboard Stats & Charts
  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, revenueRes, growthRes] = await Promise.all([
        getDashboardStats(),
        getRevenueOverview(),
        getWorkspaceGrowth()
      ]);

      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      if (revenueRes.success && revenueRes.data) setRevenue(revenueRes.data);
      if (growthRes.success && growthRes.data) setGrowth(growthRes.data);
    } catch (error) {
      console.error("Error loading dashboard data", error);
      toast.error("Failed to load platform statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Recent Workspaces
  const fetchWorkspaces = useCallback(async (page: number) => {
    setWorkspacesLoading(true);
    try {
      const res = await getRecentWorkspaces(page, 5);
      if (res.success && res.data) {
        setWorkspaces(res.data.workspaces);
        setWorkspaceTotal(res.data.total);
      }
    } catch (error) {
      console.error("Error loading workspaces", error);
      toast.error("Failed to load recent workspaces.");
    } finally {
      setWorkspacesLoading(false);
    }
  }, []);

  // Fetch Pending Tickets
  const fetchTickets = useCallback(async (page: number) => {
    setTicketsLoading(true);
    try {
      const res = await getPendingTickets(page, 5);
      if (res.success && res.data) {
        setTickets(res.data.tickets);
        setTicketTotal(res.data.total);
      }
    } catch (error) {
      console.error("Error loading tickets", error);
      toast.error("Failed to load pending tickets.");
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchWorkspaces(workspacePage);
  }, [workspacePage, fetchWorkspaces]);

  useEffect(() => {
    fetchTickets(ticketPage);
  }, [ticketPage, fetchTickets]);

  // Handle Workspace Suspension
  const handleToggleSuspend = async (workspace: RecentWorkspace) => {
    setWorkspaceSuspending(true);
    try {
      const res = await toggleSuspendWorkspace(workspace.workspaceId);
      if (res.success) {
        toast.success(
          workspace.status === "suspended"
            ? "Workspace unsuspended successfully"
            : "Workspace suspended successfully"
        );
        
        // Update local UI state directly to avoid refetching all workspaces and dashboard charts
        const newStatus = workspace.status === "suspended" ? "active" : "suspended";
        setWorkspaces((prev) =>
          prev.map((w) =>
            w.workspaceId === workspace.workspaceId
              ? { ...w, status: newStatus }
              : w
          )
        );

        setSelectedWorkspace(null);
      } else {
        toast.error("Failed to update workspace status.");
      }
    } catch (error) {
      console.error("Error suspending workspace", error);
      toast.error("Failed to change workspace status.");
    } finally {
      setWorkspaceSuspending(false);
    }
  };

  // Handle Ticket Resolution
  const handleResolveTicket = async (ticketId: string) => {
    setTicketStatusUpdating(true);
    try {
      const res = await updateTicketStatus(ticketId, TicketStatus.RESOLVED);
      if (res.success) {
        toast.success("Ticket resolved successfully!");
        setSelectedTicket(null);
        fetchTickets(ticketPage);
        fetchDashboardData();
      } else {
        toast.error("Failed to resolve ticket.");
      }
    } catch (error) {
      console.error("Error resolving ticket", error);
      toast.error("Failed to update ticket status.");
    } finally {
      setTicketStatusUpdating(false);
    }
  };

  // Trends calculation helper
  const renderTrend = (value: number) => {
    if (value === 0) return null;
    const isUp = value > 0;
    return (
      <span
        className={cn(
          "text-xs font-semibold flex items-center px-1.5 py-0.5 rounded-full",
          isUp
            ? "text-emerald-500 bg-emerald-500/10"
            : "text-rose-500 bg-rose-500/10"
        )}
      >
        {isUp ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
        {isUp ? "+" : ""}
        {value}%
      </span>
    );
  };

  const workspacePagesCount = Math.ceil(workspaceTotal / 5) || 1;
  const ticketPagesCount = Math.ceil(ticketTotal / 5) || 1;

  return (
    <div className="space-y-8 text-zinc-100 pb-12">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
          Super Admin Dashboard
        </h1>
        <p className="text-sm text-zinc-400">
          Real-time metrics, subscription billing overview, and workspace management.
        </p>
      </div>

      {/* Top Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-28 bg-zinc-900/60 rounded-xl border border-zinc-800 animate-pulse flex flex-col justify-between p-4"
              >
                <div className="h-4 bg-zinc-800 rounded w-2/3" />
                <div className="h-8 bg-zinc-800 rounded w-1/3 mt-2" />
              </div>
            ))
          : stats && [
              {
                title: "Total Workspaces",
                value: stats.totalWorkspaces.toLocaleString(),
                trend: stats.totalWorkspacesChange,
                icon: Building2,
                color: "text-emerald-500 bg-emerald-500/10"
              },
              {
                title: "Total Users",
                value: stats.totalUsers.toLocaleString(),
                trend: stats.totalUsersChange,
                icon: Users,
                color: "text-cyan-500 bg-cyan-500/10"
              },
              {
                title: "Active Subscriptions",
                value: stats.activeSubscriptions.toString(),
                trend: stats.activeSubscriptionsChange,
                icon: CreditCard,
                color: "text-purple-500 bg-purple-500/10"
              },
              {
                title: "Pending Tickets",
                value: stats.pendingTickets.toString(),
                trend: 0,
                icon: MessageSquare,
                color: "text-amber-500 bg-amber-500/10"
              },
              {
                title: "Revenue (Month)",
                value: `₹${stats.revenueThisMonth.toLocaleString()}`,
                trend: stats.revenueThisMonthChange,
                icon: DollarSign,
                color: "text-emerald-500 bg-emerald-500/10"
              },
              {
                title: "New Workspaces",
                value: stats.newWorkspacesThisMonth.toString(),
                trend: stats.newWorkspacesThisMonthChange,
                icon: Calendar,
                color: "text-blue-500 bg-blue-500/10"
              }
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800/80 hover:border-emerald-500/30 transition-all duration-300 shadow-lg relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                    <CardTitle className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      {card.title}
                    </CardTitle>
                    <div className={cn("p-2 rounded-lg transition-transform duration-300 group-hover:scale-110", card.color)}>
                      <card.icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex flex-col justify-between h-[64px]">
                    <div className="text-2xl font-bold text-white tracking-tight">
                      {card.value}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {renderTrend(card.trend)}
                      {card.trend !== 0 && (
                        <span className="text-[10px] text-zinc-500">vs last month</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      {/* Revenue & Growth Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Overview Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800 shadow-xl overflow-hidden h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-zinc-800/60">
              <div>
                <CardTitle className="text-lg font-bold text-white">Revenue Overview</CardTitle>
                <p className="text-xs text-zinc-500 mt-0.5">Platform sales aggregates & projections</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                  Paid Orgs: {revenue?.activePaidOrganizations || 0}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col justify-between">
              {loading ? (
                <div className="h-64 bg-zinc-800/10 animate-pulse rounded-lg flex items-center justify-center text-zinc-600">
                  Loading revenue graphs...
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Top Billing Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-3.5 flex flex-col justify-center">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Monthly Revenue</span>
                      <span className="text-xl font-bold text-white mt-1">₹{(revenue?.monthlyRevenue || 0).toLocaleString()}</span>
                    </div>
                    <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-3.5 flex flex-col justify-center">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Yearly Revenue</span>
                      <span className="text-xl font-bold text-white mt-1">₹{(revenue?.yearlyRevenue || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Recharts AreaChart */}
                  <div className="h-[220px] w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={revenue?.monthlyHistory || []}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                          dataKey="month"
                          stroke="#71717a"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#71717a"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#18181b",
                            borderColor: "#3f3f46",
                            borderRadius: "8px",
                            color: "#f4f4f5"
                          }}
                          labelStyle={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "bold" }}
                          itemStyle={{ color: "#10b981", fontSize: "13px" }}
                          formatter={(v: number | string | readonly (string | number)[] | undefined) => [`₹${Number(Array.isArray(v) ? v[0] : v || 0).toLocaleString()}`, "Revenue"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10b981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Workspace Growth Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800 shadow-xl overflow-hidden h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-zinc-800/60">
              <div>
                <CardTitle className="text-lg font-bold text-white">Workspace Growth</CardTitle>
                <p className="text-xs text-zinc-500 mt-0.5">Newly created vs upgraded organization signups</p>
              </div>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col justify-between">
              {loading ? (
                <div className="h-64 bg-zinc-800/10 animate-pulse rounded-lg flex items-center justify-center text-zinc-600">
                  Loading growth graphs...
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Stats Breakdowns */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-3 flex flex-col justify-center">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500">New (30 Days)</span>
                      <span className="text-lg font-bold text-white mt-1">{growth?.newlyCreated || 0}</span>
                    </div>
                    <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-3 flex flex-col justify-center">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500">Free / Trial</span>
                      <span className="text-lg font-bold text-emerald-500 mt-1">{growth?.trial || 0}</span>
                    </div>
                    <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-3 flex flex-col justify-center">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500">Upgraded Paid</span>
                      <span className="text-lg font-bold text-purple-500 mt-1">{growth?.upgraded || 0}</span>
                    </div>
                  </div>

                  {/* Growth History Chart */}
                  <div className="h-[220px] w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={growth?.growthHistory || []}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                          dataKey="month"
                          stroke="#71717a"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#71717a"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#18181b",
                            borderColor: "#3f3f46",
                            borderRadius: "8px",
                            color: "#f4f4f5"
                          }}
                          labelStyle={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "bold" }}
                          itemStyle={{ color: "#3b82f6", fontSize: "13px" }}
                          formatter={(v) => [v, "New Workspaces"]}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {(growth?.growthHistory || []).map((_entry: unknown, idx: number) => (
                            <Cell key={`cell-${idx}`} fill={idx === 5 ? "#10b981" : "#3b82f6"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Support Pending Tickets Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800 shadow-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-zinc-800/60">
            <div>
              <CardTitle className="text-lg font-bold text-white">Pending Tickets</CardTitle>
              <p className="text-xs text-zinc-500 mt-0.5">Critical support questions requiring agent attention</p>
            </div>
            <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/15 border-transparent">
              {ticketTotal} Active Support Request{ticketTotal === 1 ? "" : "s"}
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            {ticketsLoading ? (
              <div className="p-8 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 bg-zinc-800/10 animate-pulse rounded-lg w-full" />
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-white">Inbox Clean!</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-[280px]">
                  All support tickets are resolved. Keep up the amazing service!
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-zinc-950/20 border-b border-zinc-800/80">
                      <TableRow className="border-b border-zinc-800/80 hover:bg-transparent">
                        <TableHead className="text-zinc-400 font-semibold py-3">Ticket Title</TableHead>
                        <TableHead className="text-zinc-400 font-semibold py-3">Workspace</TableHead>
                        <TableHead className="text-zinc-400 font-semibold py-3">Priority</TableHead>
                        <TableHead className="text-zinc-400 font-semibold py-3">Status</TableHead>
                        <TableHead className="text-zinc-400 font-semibold py-3">Created At</TableHead>
                        <TableHead className="text-zinc-400 font-semibold py-3 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.map((ticket) => (
                        <TableRow key={ticket.ticketId} className="border-b border-zinc-800/60 hover:bg-zinc-800/10 transition-colors">
                          <TableCell className="font-medium text-zinc-100 py-3">{ticket.title}</TableCell>
                          <TableCell className="text-zinc-300 py-3">{ticket.workspaceName}</TableCell>
                          <TableCell className="py-3">
                            <Badge
                              className={cn(
                                "border-transparent",
                                ticket.priority === "HIGH"
                                  ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/15"
                                  : ticket.priority === "MEDIUM"
                                  ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/15"
                                  : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/15"
                              )}
                            >
                              {ticket.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3">
                            <Badge
                              className={cn(
                                "border-transparent",
                                ticket.status === "OPEN"
                                  ? "bg-sky-500/10 text-sky-500"
                                  : ticket.status === "IN_PROGRESS"
                                  ? "bg-yellow-500/10 text-yellow-500"
                                  : "bg-emerald-500/10 text-emerald-500"
                              )}
                            >
                              {ticket.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-zinc-400 text-xs py-3">
                            {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </TableCell>
                          <TableCell className="py-3 text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs"
                              onClick={() => setSelectedTicket(ticket)}
                            >
                              Open Ticket
                            </Button>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                              onClick={() => handleResolveTicket(ticket.ticketId)}
                            >
                              Resolve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Tickets Pagination */}
                {ticketPagesCount > 1 && (
                  <div className="flex items-center justify-between p-4 border-t border-zinc-800 bg-zinc-950/10">
                    <span className="text-xs text-zinc-500">
                      Showing Page {ticketPage} of {ticketPagesCount} ({ticketTotal} tickets)
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                        onClick={() => setTicketPage((p) => Math.max(1, p - 1))}
                        disabled={ticketPage === 1}
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                        onClick={() => setTicketPage((p) => Math.min(ticketPagesCount, p + 1))}
                        disabled={ticketPage === ticketPagesCount}
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Workspaces Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800 shadow-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-zinc-800/60">
            <div>
              <CardTitle className="text-lg font-bold text-white">Recent Workspaces</CardTitle>
              <p className="text-xs text-zinc-500 mt-0.5">SaaS accounts, trial accounts, and blocked profiles</p>
            </div>
            <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">
              Total Workspaces: {workspaceTotal}
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            {workspacesLoading ? (
              <div className="p-8 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 bg-zinc-800/10 animate-pulse rounded-lg w-full" />
                ))}
              </div>
            ) : workspaces.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-white">No Workspaces Found</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-[280px]">
                  Signups will show up here.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-zinc-950/20 border-b border-zinc-800/80">
                      <TableRow className="border-b border-zinc-800/80 hover:bg-transparent">
                        <TableHead className="text-zinc-400 font-semibold py-3">Workspace Name</TableHead>
                        <TableHead className="text-zinc-400 font-semibold py-3">Owner</TableHead>
                        <TableHead className="text-zinc-400 font-semibold py-3">Current Plan</TableHead>
                        <TableHead className="text-zinc-400 font-semibold py-3">Members Count</TableHead>
                        <TableHead className="text-zinc-400 font-semibold py-3">Created Date</TableHead>
                        <TableHead className="text-zinc-400 font-semibold py-3">Status</TableHead>
                        <TableHead className="text-zinc-400 font-semibold py-3 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workspaces.map((workspace) => (
                        <TableRow key={workspace.workspaceId} className="border-b border-zinc-800/60 hover:bg-zinc-800/10 transition-colors">
                          <TableCell className="font-medium text-zinc-100 py-3">{workspace.name}</TableCell>
                          <TableCell className="py-3">
                            <div className="flex flex-col">
                              <span className="text-zinc-200 text-sm font-medium">{workspace.ownerName}</span>
                              <span className="text-zinc-500 text-xs">{workspace.ownerEmail}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <Badge
                              className={cn(
                                "border-transparent text-xs",
                                workspace.planName === "ENTERPRISE"
                                  ? "bg-purple-500/10 text-purple-500"
                                  : workspace.planName === "PRO"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-zinc-700/20 text-zinc-400"
                              )}
                            >
                              {workspace.planName}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-zinc-300 py-3 font-semibold">
                            {workspace.membersCount}
                          </TableCell>
                          <TableCell className="text-zinc-400 text-xs py-3">
                            {new Date(workspace.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </TableCell>
                          <TableCell className="py-3">
                            <Badge
                              className={cn(
                                "border-transparent text-xs",
                                workspace.status === "active"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : workspace.status === "suspended"
                                  ? "bg-rose-500/10 text-rose-500"
                                  : "bg-blue-500/10 text-blue-500"
                              )}
                            >
                              {workspace.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs"
                              onClick={() => setSelectedWorkspace(workspace)}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant={workspace.status === "suspended" ? "outline" : "destructive"}
                              className={cn(
                                "text-xs font-semibold transition-colors",
                                workspace.status === "suspended"
                                  ? "border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                                  : "bg-rose-950/20 hover:bg-rose-900/40 text-rose-500 border border-rose-800/30"
                              )}
                              onClick={() => handleToggleSuspend(workspace)}
                              disabled={workspaceSuspending}
                            >
                              {workspace.status === "suspended" ? "Unsuspend" : "Suspend"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Workspaces Pagination */}
                {workspacePagesCount > 1 && (
                  <div className="flex items-center justify-between p-4 border-t border-zinc-800 bg-zinc-950/10">
                    <span className="text-xs text-zinc-500">
                      Showing Page {workspacePage} of {workspacePagesCount} ({workspaceTotal} workspaces)
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                        onClick={() => setWorkspacePage((p) => Math.max(1, p - 1))}
                        disabled={workspacePage === 1}
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                        onClick={() => setWorkspacePage((p) => Math.min(workspacePagesCount, p + 1))}
                        disabled={workspacePage === workspacePagesCount}
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Workspace View Dialog */}
      <AnimatePresence>
        {selectedWorkspace && (
          <Dialog open={!!selectedWorkspace} onOpenChange={() => setSelectedWorkspace(null)}>
            <DialogContent className="bg-zinc-900/95 border-zinc-800/90 text-zinc-100 max-w-md backdrop-blur-lg">
              <DialogHeader className="border-b border-zinc-800 pb-3">
                <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
                  <Building2 className="h-5 w-5 text-emerald-500" />
                  Workspace Details
                </DialogTitle>
                <DialogDescription className="text-zinc-500 text-xs">
                  Review organization statistics and license details.
                </DialogDescription>
              </DialogHeader>

              <div className="py-6 space-y-5">
                <div className="flex items-center gap-4 bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/50">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-sm ring-1 ring-zinc-700">
                    {selectedWorkspace.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base leading-none">{selectedWorkspace.name}</h3>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mt-1">
                      ID: {selectedWorkspace.workspaceId}
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5 px-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <User size={15} className="text-zinc-500" /> Owner Name
                    </span>
                    <span className="font-semibold text-zinc-200">{selectedWorkspace.ownerName}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <Mail size={15} className="text-zinc-500" /> Owner Email
                    </span>
                    <span className="font-semibold text-zinc-200 truncate max-w-[200px]">{selectedWorkspace.ownerEmail}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <CreditCard size={15} className="text-zinc-500" /> Subscription Plan
                    </span>
                    <Badge className="bg-emerald-500/10 text-emerald-500 font-bold border-transparent text-xs">
                      {selectedWorkspace.planName}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <Users size={15} className="text-zinc-500" /> Workspace Members
                    </span>
                    <span className="font-bold text-zinc-200">{selectedWorkspace.membersCount} Members</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <Calendar size={15} className="text-zinc-500" /> Setup Date
                    </span>
                    <span className="font-semibold text-zinc-300">
                      {new Date(selectedWorkspace.createdAt).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm border-t border-zinc-800 pt-3 mt-2">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <Activity size={15} className="text-zinc-500" /> Account Status
                    </span>
                    <Badge
                      className={cn(
                        "border-transparent font-bold text-xs",
                        selectedWorkspace.status === "active"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : selectedWorkspace.status === "suspended"
                          ? "bg-rose-500/10 text-rose-500"
                          : "bg-blue-500/10 text-blue-500"
                      )}
                    >
                      {selectedWorkspace.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <DialogFooter className="border-t border-zinc-800 pt-3 gap-2">
                <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white" onClick={() => setSelectedWorkspace(null)}>
                  Close Details
                </Button>
                <Button
                  variant={selectedWorkspace.status === "suspended" ? "default" : "destructive"}
                  className={cn(
                    "font-semibold text-sm",
                    selectedWorkspace.status === "suspended" ? "bg-emerald-600 hover:bg-emerald-500 text-white" : ""
                  )}
                  onClick={() => handleToggleSuspend(selectedWorkspace)}
                  disabled={workspaceSuspending}
                >
                  {selectedWorkspace.status === "suspended" ? "Activate Account" : "Suspend Account"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Ticket View Dialog */}
      <AnimatePresence>
        {selectedTicket && (
          <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
            <DialogContent className="bg-zinc-900/95 border-zinc-800/90 text-zinc-100 max-w-md backdrop-blur-lg">
              <DialogHeader className="border-b border-zinc-800 pb-3">
                <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
                  <MessageSquare className="h-5 w-5 text-amber-500" />
                  Support Ticket Review
                </DialogTitle>
                <DialogDescription className="text-zinc-500 text-xs">
                  Respond to or resolve active customer support query.
                </DialogDescription>
              </DialogHeader>

              <div className="py-6 space-y-5">
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/50 space-y-1.5">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Title</span>
                  <h3 className="font-semibold text-white text-base leading-snug">{selectedTicket.title}</h3>
                </div>

                <div className="space-y-3 px-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <Building2 size={15} className="text-zinc-500" /> Tenant Workspace
                    </span>
                    <span className="font-semibold text-zinc-200">{selectedTicket.workspaceName}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <AlertTriangle size={15} className="text-zinc-500" /> Severity Level
                    </span>
                    <Badge
                      className={cn(
                        "border-transparent font-bold text-xs",
                        selectedTicket.priority === "HIGH"
                          ? "bg-rose-500/10 text-rose-500"
                          : selectedTicket.priority === "MEDIUM"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-blue-500/10 text-blue-500"
                      )}
                    >
                      {selectedTicket.priority} PRIORITY
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <Clock size={15} className="text-zinc-500" /> Submitted On
                    </span>
                    <span className="font-semibold text-zinc-300">
                      {new Date(selectedTicket.createdAt).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm border-t border-zinc-800 pt-3 mt-2">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <Activity size={15} className="text-zinc-500" /> Support Status
                    </span>
                    <Badge
                      className={cn(
                        "border-transparent font-bold text-xs",
                        selectedTicket.status === "OPEN"
                          ? "bg-sky-500/10 text-sky-500"
                          : selectedTicket.status === "IN_PROGRESS"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-emerald-500/10 text-emerald-500"
                      )}
                    >
                      {selectedTicket.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <DialogFooter className="border-t border-zinc-800 pt-3 gap-2">
                <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white" onClick={() => setSelectedTicket(null)}>
                  Close Ticket
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm"
                  onClick={() => handleResolveTicket(selectedTicket.ticketId)}
                  disabled={ticketStatusUpdating}
                >
                  Mark as Resolved
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}

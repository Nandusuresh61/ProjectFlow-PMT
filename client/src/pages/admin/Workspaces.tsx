import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Building2,
  ShieldAlert,
  ShieldCheck,
  User,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/Loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getAllWorkspaces, getWorkspaceDetails, toggleSuspendWorkspace } from "@/services/superAdmin/superadmin.api";
import { WorkspaceDetailsModal } from "@/components/admin/WorkspaceDetailsModal";
import type { WorkspaceWithDetails, WorkspaceDetails } from "@/types/superadmin.types";
import CustomTable, { type TableColumn } from "@/components/table/CustomTable";

export default function Workspaces() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [workspaces, setWorkspaces] = useState<WorkspaceWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalWorkspaces, setTotalWorkspaces] = useState(0);
  const itemsPerPage = 7;

  // Modal State
  const [selectedWorkspaceDetails, setSelectedWorkspaceDetails] = useState<WorkspaceDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      setLoading(true);
      try {
        const response = await getAllWorkspaces({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        const data = response?.data;
        if (data) {
          setWorkspaces(data.workspaces || []);
          setTotalWorkspaces(data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch workspaces:", error);
        toast.error("Failed to load workspaces");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [currentPage, debouncedSearch, itemsPerPage]);

  const totalPages = Math.ceil(totalWorkspaces / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const handleViewDetails = async (workspaceId: string) => {
    setIsModalOpen(true);
    setIsDetailsLoading(true);
    setSelectedWorkspaceDetails(null);
    try {
      const response = await getWorkspaceDetails(workspaceId);
      if (response?.data) {
        setSelectedWorkspaceDetails(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch workspace details:", error);
      toast.error("Failed to load workspace details");
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleToggleSuspend = async (workspaceId: string) => {
    try {
      const response = await toggleSuspendWorkspace(workspaceId);
      if (response?.success) {
        toast.success(response.message || "Workspace status updated");
        // Update local state
        setWorkspaces((prev) =>
          prev.map((w) =>
            w.workspaceId === workspaceId ? { ...w, isSuspended: !w.isSuspended } : w
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle suspension status:", error);
      toast.error("An error occurred while updating workspace status");
    }
  };

  // ── Column definitions ────────────────────────────────────────────────────
  const columns: TableColumn<WorkspaceWithDetails>[] = [
    {
      key: "sno",
      header: "S.No",
      headerClassName: "w-[40px] text-zinc-400 font-semibold px-4 pl-6",
      cellClassName: "px-4 pl-6 font-medium text-zinc-500 tabular-nums",
      render: (_, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      key: "name",
      header: "Workspace",
      headerClassName: "w-[250px] text-zinc-400 font-semibold",
      cellClassName: "text-zinc-200",
      render: (workspace) => (
        <div className="flex items-center gap-3 py-1">
          <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20 text-green-500 shadow-sm shadow-green-500/5 group-hover:scale-110 transition-transform">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-100 group-hover:text-green-400 transition-colors uppercase tracking-tight text-sm">
              {workspace.name}
            </span>
            <span className="text-[10px] text-zinc-500 font-medium px-1.5 py-0.5 rounded-full bg-zinc-800/50 w-fit mt-1">
              ID: {workspace.workspaceId.slice(-6).toUpperCase()}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "ownerName",
      header: "Owner",
      headerClassName: "text-zinc-400 font-semibold",
      cellClassName: "text-zinc-300",
      render: (workspace) => (
        <div className="flex flex-col gap-1 py-1">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">
              <User className="h-3 w-3 text-zinc-400" />
            </div>
            {workspace.ownerName}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 ml-[26px]">
            <span className="truncate max-w-[150px]">{workspace.ownerEmail}</span>
          </div>
        </div>
      ),
    },
    {
      key: "planName",
      header: "Plan",
      headerClassName: "text-zinc-400 font-semibold text-center",
      cellClassName: "text-center",
      render: (workspace) => (
        <Badge
          variant="outline"
          className="font-semibold border-indigo-500/30 text-indigo-400 bg-indigo-500/5 px-2.5 py-1"
        >
          <CreditCard className="h-3 w-3 mr-1.5" />
          {workspace.planName}
        </Badge>
      ),
    },
    {
      key: "isSuspended",
      header: "Status",
      headerClassName: "text-zinc-400 font-semibold text-center",
      cellClassName: "text-center",
      render: (workspace) => (
        <Badge
          variant={workspace.isSuspended ? "destructive" : "default"}
          className={cn(
            "font-semibold px-2.5 py-1",
            workspace.isSuspended
              ? "bg-red-500/10 text-red-500 border-red-500/20"
              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          )}
        >
          {workspace.isSuspended ? (
            <><ShieldAlert className="h-3 w-3 mr-1.5" /> Suspended</>
          ) : (
            <><ShieldCheck className="h-3 w-3 mr-1.5" /> Active</>
          )}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right text-zinc-400",
      cellClassName: "text-right",
      render: (workspace) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-zinc-500 hover:text-white hover:bg-zinc-800"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-zinc-900 border-zinc-800 text-zinc-200"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="focus:bg-zinc-800 focus:text-white cursor-pointer"
              onSelect={() => {
                setTimeout(() => handleViewDetails(workspace.workspaceId), 100);
              }}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem
              className={`${workspace.isSuspended ? "text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-400" : "text-red-500 focus:bg-red-500/10 focus:text-red-400"
                } cursor-pointer`}
              onSelect={() => handleToggleSuspend(workspace.workspaceId)}
            >
              {workspace.isSuspended ? "Unsuspend Workspace" : "Suspend Workspace"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // ── Toolbar: search input ─────────────────────────────────────────────────
  const toolbar = (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-2">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          Workspaces
        </h1>
        <p className="text-zinc-500 text-sm font-medium">Monitoring {totalWorkspaces} active organizations and workspaces.</p>
      </div>
      <div className="relative w-full sm:w-auto overflow-hidden rounded-xl shadow-2xl shadow-green-500/5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
        <Input
          placeholder="Filter workspaces by name or owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-6 w-full sm:w-80 bg-zinc-900/50 border-zinc-800 text-zinc-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 backdrop-blur-sm transition-all placeholder:text-zinc-600 font-medium"
        />
      </div>
    </div>
  );

  // ── Footer: server-side pagination controls ───────────────────────────────
  const footer = (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-zinc-800/50 pt-5 px-1 gap-4 mt-2">
      <div className="text-sm text-zinc-500 font-medium">
        Showing{" "}
        <span className="text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded-md mx-0.5">
          {totalWorkspaces > 0 ? startIndex + 1 : 0}
        </span>{" "}
        to{" "}
        <span className="text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded-md mx-0.5">
          {Math.min(startIndex + itemsPerPage, totalWorkspaces)}
        </span>{" "}
        of <span className="text-zinc-200 font-bold ml-1">{totalWorkspaces}</span> records
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="h-9 px-4 border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <div className="flex items-center justify-center h-9 px-4 rounded-md border border-zinc-800 bg-zinc-900/50 text-xs font-bold text-green-500">
          {currentPage} / {totalPages || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="h-9 px-4 border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 backdrop-blur-sm transition-all"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 text-zinc-100"
    >
      <CustomTable<WorkspaceWithDetails>
        columns={columns}
        data={workspaces}
        rowKey={(w) => w.workspaceId}
        isLoading={loading}
        skeletonRows={itemsPerPage}
        emptyState={
          <div className="h-48 flex flex-col items-center justify-center text-zinc-500 gap-4 bg-zinc-950/20 rounded-xl border border-dashed border-zinc-800">
            <div className="h-16 w-16 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-inner shadow-black/50">
              <Building2 className="h-8 w-8 text-zinc-700" />
            </div>
            <div className="text-center">
              <p className="text-zinc-400 font-semibold uppercase tracking-widest text-xs">No Results</p>
              <p className="text-zinc-600 text-sm mt-1">No workspaces found matching your search criteria.</p>
            </div>
          </div>
        }
        tableClassName="bg-zinc-950/20"
        className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 shadow-2xl shadow-black/40 p-4 md:p-6 backdrop-blur-xl"
        toolbar={toolbar}
        footer={footer}
        paginate={false}
      />

      <WorkspaceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workspace={selectedWorkspaceDetails}
        loading={isDetailsLoading}
      />

      {loading && <span className="sr-only"><Loader text="Loading workspaces..." /></span>}
    </motion.div>
  );
}

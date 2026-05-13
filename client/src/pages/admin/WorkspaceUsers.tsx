import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/Loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getAllUsers, getUserDetails, toggleBlockUser } from "@/services/superAdmin/superadmin.api";
import { UserDetailsModal } from "@/components/admin/UserDetailsModal";
import type { UserDetails } from "@/types/superadmin.types";
import CustomTable, { type TableColumn } from "@/components/table/CustomTable";

interface Workspace {
  workspaceId: string;
  name: string;
  role: string;
}

interface User {
  userId: string;
  fullName: string;
  email: string;
  isBlocked: boolean;
  isSuperAdmin: boolean;
  profileImage?: string;
  createdAt: string;
  workspaces: Workspace[];
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

export default function Workspaces() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 7;

  // Modal State
  const [selectedUserDetails, setSelectedUserDetails] = useState<UserDetails | null>(null);
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

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllUsers({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        const data = response?.data;
        if (data) {
          setUsers(data.users || []);
          setTotalUsers(data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, debouncedSearch, itemsPerPage]);

  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const handleViewDetails = async (userId: string) => {
    setIsModalOpen(true);
    setIsDetailsLoading(true);
    setSelectedUserDetails(null);
    try {
      const response = await getUserDetails(userId);
      if (response?.data) {
        setSelectedUserDetails(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleToggleBlock = async (userId: string) => {
    try {
      const response = await toggleBlockUser(userId);
      if (response?.success) {
        toast.success(response.message || "User block status updated");
        // Update local state
        setUsers((prev) =>
          prev.map((u) =>
            u.userId === userId ? { ...u, isBlocked: !u.isBlocked } : u
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle block status:", error);
      toast.error("An error occurred while toggling block status");
    }
  };

  // ── Column definitions ────────────────────────────────────────────────────
  const columns: TableColumn<User>[] = [
    {
      key: "sno",
      header: "S.No",
      headerClassName: "w-[40px] text-zinc-400 font-semibold px-4 pl-6",
      cellClassName: "px-4 pl-6 font-medium text-zinc-500 tabular-nums",
      render: (_, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      key: "fullName",
      header: "User",
      headerClassName: "w-[250px] text-zinc-400 font-semibold",
      cellClassName: "text-zinc-200",
      render: (user) => (
        <div className="flex items-center gap-3 py-1">
          <div className="relative group">
            <Avatar className="h-10 w-10 border border-zinc-800 shadow-lg group-hover:border-green-500/50 transition-colors">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <AvatarFallback className="bg-zinc-800 text-green-500 font-bold text-xs uppercase">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              )}
            </Avatar>
            {user.isSuperAdmin && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                <ShieldCheck className="h-2 w-2 text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-100 group-hover:text-green-400 transition-colors tracking-tight">
              {user.fullName}
            </span>
            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">
              UID: {user.userId.slice(-6).toUpperCase()}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email Address",
      headerClassName: "text-zinc-400 font-semibold",
      cellClassName: "text-zinc-400",
      render: (user) => (
        <div className="flex items-center gap-2.5 text-sm font-medium">
          <div className="w-5 h-5 rounded-md bg-zinc-800/50 flex items-center justify-center border border-zinc-800">
            <Mail className="h-3 w-3 text-zinc-500" />
          </div>
          <span className="hover:text-zinc-200 transition-colors cursor-pointer">{user.email}</span>
        </div>
      ),
    },
    {
      key: "isBlocked",
      header: "Account Status",
      headerClassName: "text-zinc-400 font-semibold text-center",
      cellClassName: "text-center",
      render: (user) => (
        <Badge
          variant={user.isBlocked ? "destructive" : "default"}
          className={cn(
            "font-semibold px-2.5 py-1",
            user.isBlocked
              ? "bg-red-500/10 text-red-500 border-red-500/20 shadow-sm shadow-red-500/5"
              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-sm shadow-emerald-500/5"
          )}
        >
          {user.isBlocked ? (
            <><ShieldAlert className="h-3 w-3 mr-1.5" /> Blocked</>
          ) : (
            <><ShieldCheck className="h-3 w-3 mr-1.5" /> Active Account</>
          )}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Join Date",
      headerClassName: "text-zinc-400 font-semibold",
      cellClassName: "text-zinc-500",
      render: (user) => (
        <div className="flex items-center gap-2 text-sm font-medium">
          <Calendar className="h-3.5 w-3.5 text-zinc-600" />
          {new Date(user.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right text-zinc-400",
      cellClassName: "text-right",
      render: (user) => (
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
              className="focus:bg-zinc-800 focus:text-white"
              onSelect={() => {
                setTimeout(() => handleViewDetails(user.userId), 100);
              }}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            {!user.isSuperAdmin && (
              <DropdownMenuItem
                className={`${user.isBlocked ? "text-green-500 focus:bg-green-500/10 focus:text-green-400" : "text-red-500 focus:bg-red-500/10 focus:text-red-400"
                  } cursor-pointer`}
                onSelect={() => handleToggleBlock(user.userId)}
              >
                {user.isBlocked ? "Unblock user" : "Block user"}
              </DropdownMenuItem>
            )}
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
          User Management
        </h1>
        <p className="text-zinc-500 text-sm font-medium">Overseeing {totalUsers} registered users and their activities.</p>
      </div>
      <div className="relative w-full sm:w-auto overflow-hidden rounded-xl shadow-2xl shadow-green-500/5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
        <Input
          placeholder="Search by name, email or ID..."
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
          {totalUsers > 0 ? startIndex + 1 : 0}
        </span>{" "}
        to{" "}
        <span className="text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded-md mx-0.5">
          {Math.min(startIndex + itemsPerPage, totalUsers)}
        </span>{" "}
        of <span className="text-zinc-200 font-bold ml-1">{totalUsers}</span> accounts
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
      <CustomTable<User>
        columns={columns}
        data={users}
        rowKey={(user) => user.userId}
        isLoading={loading}
        skeletonRows={itemsPerPage}
        emptyState={
          <div className="h-48 flex flex-col items-center justify-center text-zinc-500 gap-4 bg-zinc-950/20 rounded-xl border border-dashed border-zinc-800">
            <div className="h-16 w-16 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-inner shadow-black/50">
              <Users className="h-8 w-8 text-zinc-700" />
            </div>
            <div className="text-center">
              <p className="text-zinc-400 font-semibold uppercase tracking-widest text-xs">No Results</p>
              <p className="text-zinc-600 text-sm mt-1">No users found matching your search criteria.</p>
            </div>
          </div>
        }
        tableClassName="bg-zinc-950/20"
        className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 shadow-2xl shadow-black/40 p-4 md:p-6 backdrop-blur-xl"
        toolbar={toolbar}
        footer={footer}
        // Pagination is server-side — handled via the footer slot above
        paginate={false}
      />

      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUserDetails}
        loading={isDetailsLoading}
      />

      {/* Loading overlay kept for screen reader accessibility */}
      {loading && <span className="sr-only"><Loader text="Loading users..." /></span>}
    </motion.div>
  );
}

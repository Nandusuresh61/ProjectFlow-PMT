import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Building2,
  Mail,
  Calendar,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
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
      key: "fullName",
      header: "User",
      headerClassName: "w-[250px] text-zinc-400",
      cellClassName: "text-zinc-200",
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-zinc-800">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" />
            ) : (
              <AvatarFallback className="bg-zinc-800 text-green-500 font-medium text-xs">
                {getInitials(user.fullName)}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="font-medium text-zinc-200">{user.fullName}</span>
          {user.isBlocked && (
            <Badge variant="destructive" className="ml-2 text-[10px] h-4 px-1.5 py-0 bg-red-500/10 text-red-500 border-red-500/20">
              <ShieldAlert className="h-2.5 w-2.5 mr-1" />
              Blocked
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      headerClassName: "text-zinc-400",
      cellClassName: "text-zinc-400",
      render: (user) => (
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-3 w-3" />
          {user.email}
        </div>
      ),
    },
    {
      key: "workspaces",
      header: "Workspaces",
      headerClassName: "text-zinc-400",
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.workspaces.length > 0 ? (
            user.workspaces.map((workspace) => (
              <Badge
                key={workspace.workspaceId}
                variant="outline"
                className="font-normal border-zinc-700 text-zinc-300 bg-zinc-800/50"
              >
                <Building2 className="h-3 w-3 mr-1" />
                {workspace.name}
                <span className="text-zinc-500 ml-1 text-[10px]">({workspace.role})</span>
              </Badge>
            ))
          ) : (
            <span className="text-zinc-600 text-xs italic">No workspaces</span>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      headerClassName: "text-zinc-400",
      cellClassName: "text-zinc-500",
      render: (user) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-3 w-3" />
          {new Date(user.createdAt).toLocaleDateString()}
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
            <DropdownMenuItem
              className={`${
                user.isBlocked ? "text-green-500 focus:bg-green-500/10 focus:text-green-400" : "text-red-500 focus:bg-red-500/10 focus:text-red-400"
              }`}
              onSelect={() => handleToggleBlock(user.userId)}
            >
              {user.isBlocked ? "Unblock user" : "Block user"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // ── Toolbar: search input ─────────────────────────────────────────────────
  const toolbar = (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Users</h1>
        <p className="text-zinc-500">Manage all users and their workspace memberships.</p>
      </div>
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 w-full sm:w-64 bg-zinc-900 border-zinc-800 text-zinc-200 focus:ring-green-500 focus:border-green-500"
        />
      </div>
    </div>
  );

  // ── Footer: server-side pagination controls ───────────────────────────────
  const footer = (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-zinc-800 pt-4 gap-3">
      <div className="text-sm text-zinc-500">
        Showing{" "}
        <span className="font-medium text-zinc-300">
          {totalUsers > 0 ? startIndex + 1 : 0}
        </span>{" "}
        to{" "}
        <span className="font-medium text-zinc-300">
          {Math.min(startIndex + itemsPerPage, totalUsers)}
        </span>{" "}
        of <span className="font-medium text-zinc-300">{totalUsers}</span> users
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
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
          <div className="h-24 flex items-center justify-center text-zinc-500">
            No users found.
          </div>
        }
        tableClassName="bg-zinc-900"
        className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm overflow-hidden"
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

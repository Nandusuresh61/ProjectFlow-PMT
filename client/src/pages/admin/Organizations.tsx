import { useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Building2,
    Mail,
    Calendar
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
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
import { cn } from "@/lib/utils";

interface Organization {
    id: string;
    name: string;
    owner: string;
    email: string;
    plan: string;
    members: number;
    createdAt: string;
    status: "Active" | "Inactive" | "Trial";
    logo?: string;
}

const dummyOrgs: Organization[] = [
    { id: "1", name: "Acme Corp", owner: "John Doe", email: "john@acme.com", plan: "Professional", members: 12, createdAt: "2024-01-15", status: "Active" },
    { id: "2", name: "TechStart Inc", owner: "Sarah Smith", email: "sarah@techstart.com", plan: "Enterprise", members: 45, createdAt: "2024-01-14", status: "Active" },
    { id: "3", name: "Design Studio", owner: "Mike Johnson", email: "mike@design.com", plan: "Starter", members: 3, createdAt: "2024-01-13", status: "Active" },
    { id: "4", name: "Global Solutions", owner: "Emily Davis", email: "emily@global.com", plan: "Enterprise", members: 120, createdAt: "2024-01-12", status: "Trial" },
    { id: "5", name: "NextGen AI", owner: "David Wilson", email: "david@nextgen.com", plan: "Professional", members: 8, createdAt: "2024-01-11", status: "Active" },
    { id: "6", name: "Cloud Systems", owner: "Jessica Brown", email: "jessica@cloud.com", plan: "Starter", members: 2, createdAt: "2024-01-10", status: "Inactive" },
    { id: "7", name: "Data Corp", owner: "Robert Taylor", email: "robert@data.com", plan: "Professional", members: 15, createdAt: "2024-01-09", status: "Active" },
    { id: "8", name: "Web Wizards", owner: "Lisa Anderson", email: "lisa@web.com", plan: "Starter", members: 4, createdAt: "2024-01-08", status: "Trial" },
    { id: "9", name: "App Masters", owner: "Kevin Thomas", email: "kevin@app.com", plan: "Professional", members: 10, createdAt: "2024-01-07", status: "Active" },
    { id: "10", name: "Security Plus", owner: "Amanda Martinez", email: "amanda@sec.com", plan: "Enterprise", members: 60, createdAt: "2024-01-06", status: "Active" },
    { id: "11", name: "Green Energy", owner: "Brian White", email: "brian@green.com", plan: "Professional", members: 22, createdAt: "2024-01-05", status: "Active" },
    { id: "12", name: "EduTech", owner: "Laura Garcia", email: "laura@edu.com", plan: "Starter", members: 5, createdAt: "2024-01-04", status: "Inactive" },
];

export default function Organizations() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const filteredOrgs = dummyOrgs.filter((org) =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredOrgs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentOrgs = filteredOrgs.slice(startIndex, startIndex + itemsPerPage);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-zinc-100"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Organizations</h1>
                    <p className="text-zinc-500">Manage detailed information about all workspace organizations.</p>
                </div>
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Search organizations..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-9 w-full sm:w-64 bg-zinc-900 border-zinc-800 text-zinc-200 focus:ring-green-500 focus:border-green-500"
                    />
                </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-950/50">
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="w-[250px] text-zinc-400">Organization</TableHead>
                            <TableHead className="text-zinc-400">Owner</TableHead>
                            <TableHead className="text-zinc-400">Plan</TableHead>
                            <TableHead className="text-zinc-400">Members</TableHead>
                            <TableHead className="text-zinc-400">Created</TableHead>
                            <TableHead className="text-zinc-400">Status</TableHead>
                            <TableHead className="text-right text-zinc-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentOrgs.length === 0 ? (
                            <TableRow className="border-zinc-800">
                                <TableCell colSpan={7} className="h-24 text-center text-zinc-500">
                                    No organizations found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentOrgs.map((org) => (
                                <TableRow key={org.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-zinc-800">
                                                <AvatarFallback className="bg-zinc-800 text-green-500 font-medium text-xs">
                                                    {getInitials(org.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-zinc-200">{org.name}</span>
                                                <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                    <Building2 className="h-3 w-3" /> Workspace
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-zinc-300">{org.owner}</span>
                                            <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> {org.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal capitalize bg-transparent border-zinc-700 text-zinc-300">
                                            {org.plan}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-zinc-400">
                                            <span className="font-medium text-zinc-200">{org.members}</span> users
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-zinc-500 text-sm">
                                            <Calendar className="h-3 w-3" /> {new Date(org.createdAt).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <span className={cn(
                                                "text-[11px] px-2 py-0.5 rounded-full font-medium border flex items-center gap-1",
                                                org.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    org.status === 'Trial' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                            )}>
                                                <span className={cn(
                                                    "h-1.5 w-1.5 rounded-full",
                                                    org.status === 'Active' ? 'bg-green-500' :
                                                        org.status === 'Trial' ? 'bg-yellow-500' :
                                                            'bg-red-500'
                                                )} />
                                                {org.status}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-500 hover:text-white hover:bg-zinc-800">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-200">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white">View details</DropdownMenuItem>
                                                <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white">Edit organization</DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-zinc-800" />
                                                <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-400">Delete organization</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                <div className="text-sm text-zinc-500">
                    Showing <span className="font-medium text-zinc-300">{filteredOrgs.length > 0 ? startIndex + 1 : 0}</span> to{" "}
                    <span className="font-medium text-zinc-300">
                        {Math.min(startIndex + itemsPerPage, filteredOrgs.length)}
                    </span>{" "}
                    of <span className="font-medium text-zinc-300">{filteredOrgs.length}</span> organizations
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
        </motion.div>
    );
}

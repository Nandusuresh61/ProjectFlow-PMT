import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { startSprint } from "@/services/sprint/sprint.api";

interface StartSprintModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sprint: any;
    workspaceId: string;
    onSuccess: (updatedSprint: any) => void;
}

export function StartSprintModal({
    open,
    onOpenChange,
    sprint,
    workspaceId,
    onSuccess,
}: StartSprintModalProps) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset when opened
    useEffect(() => {
        if (open) {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            setStartDate(`${year}-${month}-${day}`);
            
            const future = new Date();
            future.setDate(future.getDate() + 14);
            const fYear = future.getFullYear();
            const fMonth = String(future.getMonth() + 1).padStart(2, '0');
            const fDay = String(future.getDate()).padStart(2, '0');
            setEndDate(`${fYear}-${fMonth}-${fDay}`); // Default 2 week sprint
            
            setIsSubmitting(false);
        }
    }, [open]);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!startDate || !endDate) {
            toast.error("Please select both start and end dates");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            toast.error("Start date cannot be after end date");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const startDateISO = new Date(startDate).toISOString();
            const endDateISO = new Date(endDate).toISOString();

            const res = await startSprint(
                sprint.sprintId,
                startDateISO,
                endDateISO,
                workspaceId
            );

            if (res.success && res.data) {
                toast.success(`${sprint.name} has started!`);
                onSuccess(res.data);
                onOpenChange(false);
            } else {
                 toast.error(res.message || "Failed to start sprint");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to start sprint");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!sprint) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-[#060d1a] border-[#19376D] text-white p-0 overflow-hidden shadow-2xl">
                <DialogHeader className="px-6 py-4 border-b border-[#19376D] bg-[#19376D]/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#A5D7E8]/10 flex items-center justify-center">
                            <PlayCircle size={18} className="text-[#A5D7E8]" />
                        </div>
                        <DialogTitle className="text-lg font-bold">Start Sprint: {sprint.name}</DialogTitle>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <p className="text-sm text-[#576CBC]/70">
                        Select the duration for this sprint. All issues currently in this sprint will be tracked as part of the active workload.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Start Date</Label>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#576CBC]/40" />
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="bg-[#19376D]/10 border-[#576CBC]/20 text-white pl-9 text-sm focus-visible:ring-[#A5D7E8]/20"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">End Date</Label>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#576CBC]/40" />
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-[#19376D]/10 border-[#576CBC]/20 text-white pl-9 text-sm focus-visible:ring-[#A5D7E8]/20"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="text-[#576CBC] hover:text-white hover:bg-white/[0.05]"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#A5D7E8] text-[#0B2447] font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(165,215,232,0.2)]"
                        >
                            {isSubmitting ? "Starting..." : "Start Sprint"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

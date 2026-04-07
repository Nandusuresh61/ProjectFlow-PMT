import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Quote, Flag } from "lucide-react";
import { toast } from "sonner";

interface SprintCreationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    onSuccess: (sprint: any) => void;
}

export function SprintCreationModal({
    open,
    onOpenChange,
    projectId,
    onSuccess,
}: SprintCreationModalProps) {
    const [name, setName] = useState("");
    const [goal, setGoal] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset when opened
    useEffect(() => {
        if (open) {
            // Default name based on something or just empty
            setName(`Sprint ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
            setGoal("");
            setIsSubmitting(false);
        }
    }, [open]);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!name.trim()) {
            toast.error("Sprint name is required");
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Mocking the creation
            const newSprint = {
                sprintId: Math.random().toString(36).substring(2, 9),
                projectId,
                name,
                goal,
                status: "PLANNED",
                issueIds: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            toast.success("Sprint created successfully");
            onSuccess(newSprint);
            onOpenChange(false);
        } catch (error: any) {
            toast.error("Failed to create sprint");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-[#060d1a] border-[#19376D] text-white p-0 overflow-hidden shadow-2xl">
                <DialogHeader className="px-6 py-4 border-b border-[#19376D] bg-[#19376D]/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#A5D7E8]/10 flex items-center justify-center">
                            <Flag size={18} className="text-[#A5D7E8]" />
                        </div>
                        <DialogTitle className="text-lg font-bold">Create New Sprint</DialogTitle>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-1.5">
                        <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Sprint Name *</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Sprint 1, Q2 Core Features"
                            className="bg-[#19376D]/10 border-[#576CBC]/20 text-white placeholder:text-[#576CBC]/40 focus-visible:ring-[#A5D7E8]/20 focus-visible:border-[#A5D7E8]/50"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Sprint Goal</Label>
                        <div className="relative">
                            <Quote size={14} className="absolute left-3 top-3 text-[#576CBC]/40" />
                            <textarea
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                placeholder="What are we aiming to achieve?"
                                className="w-full min-h-[100px] bg-[#19376D]/10 border border-[#576CBC]/20 rounded-md py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-[#576CBC]/40 focus:outline-none focus:ring-2 focus:ring-[#A5D7E8]/20 focus:border-[#A5D7E8]/50 resize-none transition-all"
                            />
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
                            {isSubmitting ? "Creating..." : "Create Sprint"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

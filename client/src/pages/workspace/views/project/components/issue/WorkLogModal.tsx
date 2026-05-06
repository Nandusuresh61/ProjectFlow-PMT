import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/utils/error";
import { addWorkLog, updateWorkLog, type WorkLogData } from "@/services/issue/worklog.api";

interface WorkLogModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    issueId: string;
    onSuccess: () => void;
    editLog?: WorkLogData | null;
}

export function WorkLogModal({
    open,
    onOpenChange,
    issueId,
    onSuccess,
    editLog
}: WorkLogModalProps) {
    const [hours, setHours] = useState<string>(editLog ? editLog.hours.toString() : "");
    const [note, setNote] = useState<string>(editLog ? editLog.note || "" : "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        if (open) {
            setHours(editLog ? editLog.hours.toString() : "");
            setNote(editLog ? editLog.note || "" : "");
        }
    }, [open, editLog]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const hoursNum = parseFloat(hours);
        if (isNaN(hoursNum) || hoursNum <= 0) {
            toast.error("Please enter valid hours");
            return;
        }

        setIsSubmitting(true);
        try {
            if (editLog) {
                await updateWorkLog(editLog.workLogId, { hours: hoursNum, note });
                toast.success("Worklog updated");
            } else {
                await addWorkLog(issueId, { hours: hoursNum, note });
                toast.success("Work logged successfully");
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            toast.error(getErrorMessage(error) || "Failed to log work");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#060d1a] border-[#19376D] text-white max-w-md">
                <DialogTitle className="text-xl font-bold">
                    {editLog ? "Edit Worklog" : "Log Work"}
                </DialogTitle>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Hours *</Label>
                        <Input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            placeholder="e.g. 2.5"
                            className="bg-[#19376D]/20 border-[#576CBC]/20 text-white"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Note</Label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="What did you work on?"
                            className="w-full bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md p-3 text-white text-sm min-h-24 resize-none focus:outline-none focus:ring-1 focus:ring-[#A5D7E8]/50"
                        />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => onOpenChange(false)}
                            className="text-[#576CBC] hover:text-white hover:bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-[#A5D7E8] text-[#0B2447] font-bold hover:bg-white"
                        >
                            {isSubmitting ? "Saving..." : editLog ? "Update Log" : "Log Work"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

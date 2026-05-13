import { BookOpen, CheckSquare, Bug } from "lucide-react";
import { cn } from "@/lib/utils";

interface IssueTypeIconProps {
    type: string;
    size?: number;
    className?: string;
}

export const IssueTypeIcon = ({ type, size = 14, className }: IssueTypeIconProps) => {
    const typeUpper = type.toUpperCase();
    
    if (typeUpper === 'STORY') {
        return <BookOpen size={size} className={cn("text-emerald-400", className)} />;
    }
    
    if (typeUpper === 'BUG') {
        return <Bug size={size} className={cn("text-rose-400", className)} />;
    }
    
    // Default to Task
    return <CheckSquare size={size} className={cn("text-[#A5D7E8]", className)} />;
};

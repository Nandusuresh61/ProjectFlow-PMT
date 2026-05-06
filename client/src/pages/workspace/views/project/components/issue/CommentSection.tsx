import React, { useState, useEffect } from "react";
import { Send, User as UserIcon, Loader2 } from "lucide-react";
import { getIssueComments, addComment, type CommentData } from "@/services/issue/issue.api";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface CommentSectionProps {
  issueId: string;
  membersMap: Record<string, { userId: string; fullName: string; profileImage: string; role: string }>;
}

export function CommentSection({ issueId, membersMap }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const response = await getIssueComments(issueId);
        if (response.success && response.data) {
          setComments(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [issueId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await addComment(issueId, newComment.trim());
      if (response.success && response.data) {
        setComments((prev) => [...prev, response.data!]);
        setNewComment("");
        toast.success("Comment added");
      }
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#19376D]/50 pb-2">
        <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest text-white/50">
          Comments
        </span>
        <span className="text-xs font-bold text-[#A5D7E8]">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#A5D7E8] animate-spin" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => {
            const author = membersMap[comment.authorId];
            return (
              <div key={comment.commentId} className="flex gap-3 group animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex-shrink-0">
                  {author?.profileImage ? (
                    <img 
                      src={author.profileImage} 
                      alt={author.fullName} 
                      className="w-8 h-8 rounded-full border border-[#576CBC]/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#19376D] flex items-center justify-center text-[10px] font-black text-[#A5D7E8] border border-[#576CBC]/20">
                      {author?.fullName?.substring(0, 2).toUpperCase() || <UserIcon size={14} />}
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#A5D7E8]">
                      {author?.fullName || "Unknown User"}
                    </span>
                    <span className="text-[10px] text-[#576CBC]/60 uppercase tracking-widest font-black">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="text-sm text-white/80 bg-white/[0.02] border border-white/5 p-3 rounded-xl leading-relaxed">
                    {comment.content}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-[#576CBC]/50 italic text-center py-4">No comments yet. Be the first to comment!</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative mt-4 group">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full bg-[#19376D]/10 border border-[#576CBC]/20 rounded-xl p-3 pr-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#A5D7E8]/50 focus:bg-[#19376D]/20 transition-all resize-none min-h-[80px]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="absolute right-3 bottom-3 p-2 bg-[#A5D7E8] text-[#0B2447] rounded-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#A5D7E8]/10"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </form>
      <p className="text-[10px] text-[#576CBC]/40 text-center uppercase tracking-widest font-black">
        Press Enter to post, Shift + Enter for new line
      </p>
    </div>
  );
}

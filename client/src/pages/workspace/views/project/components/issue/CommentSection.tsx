import React, { useState, useEffect, useRef } from "react";
import { Send, User as UserIcon, Loader2, Smile, Paperclip, X, Image as ImageIcon } from "lucide-react";
import { getIssueComments, addComment, type CommentData } from "@/services/issue/issue.api";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface CommentSectionProps {
  issueId: string;
  membersMap: Record<string, { userId: string; fullName: string; profileImage: string; role: string }>;
}

const COMMON_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "👏", "🎉", "✅", "🚀", "👀", "💯"];

export function CommentSection({ issueId, membersMap }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!newComment.trim() && attachments.length === 0) return;

    try {
      setIsSubmitting(true);
      
      const mentionedUserIds = Object.values(membersMap)
        .filter(m => newComment.includes(`@${m.fullName}`))
        .map(m => m.userId);

      const response = await addComment(issueId, newComment.trim(), mentionedUserIds, attachments);
      if (response.success && response.data) {
        setComments((prev) => [...prev, response.data!]);
        setNewComment("");
        setAttachments([]);
        toast.success("Comment added");
      }
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const urls = await Promise.all(uploadPromises);
      setAttachments(prev => [...prev, ...urls]);
      toast.success(`${files.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload attachments");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewComment(value);

    const lastAtPos = value.lastIndexOf("@");
    if (lastAtPos !== -1 && (lastAtPos === 0 || value[lastAtPos - 1] === " ")) {
      const query = value.substring(lastAtPos + 1);
      if (!query.includes(" ")) {
        setMentionQuery(query);
        setShowMentionList(true);
        return;
      }
    }
    setShowMentionList(false);
  };

  const insertEmoji = (emoji: string) => {
    setNewComment(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleMentionSelect = (userId: string, fullName: string) => {
    const lastAtPos = newComment.lastIndexOf("@");
    const newValue = newComment.substring(0, lastAtPos) + `@${fullName} ` + newComment.substring(newComment.indexOf(" ", lastAtPos) !== -1 ? newComment.indexOf(" ", lastAtPos) : newComment.length);
    setNewComment(newValue);
    setShowMentionList(false);
    textareaRef.current?.focus();
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const renderContent = (content: string) => {
    if (!content) return null;

    // Create a regex that matches @followed by any member's full name
    const memberNames = Object.values(membersMap).map(m => m.fullName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (memberNames.length === 0) return content;

    const mentionRegex = new RegExp(`(@(${memberNames.join('|')}))`, 'g');
    const parts = content.split(mentionRegex);

    return parts.map((part, i) => {
      const member = Object.values(membersMap).find(m => `@${m.fullName}` === part);
      if (member) {
        return (
          <span 
            key={i} 
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#A5D7E8]/10 text-[#A5D7E8] font-bold border border-[#A5D7E8]/20 transition-all hover:bg-[#A5D7E8]/20 cursor-default align-baseline mx-0.5"
          >
            <span className="text-[10px] opacity-70">@</span>
            {member.fullName}
          </span>
        );
      }
      // If the part is the captured inner group (the name without @), skip it
      if (memberNames.includes(part)) return null;
      
      return part;
    });
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
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#A5D7E8]">
                      {author?.fullName || "Unknown User"}
                    </span>
                    <span className="text-[10px] text-[#576CBC]/60 uppercase tracking-widest font-black">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="text-sm text-white/80 bg-white/[0.02] border border-white/5 p-3 rounded-xl leading-relaxed">
                    {renderContent(comment.content)}
                    
                    {comment.attachments && comment.attachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {comment.attachments.map((url, idx) => (
                          <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block">
                            <img 
                              src={url} 
                              alt="attachment" 
                              className="max-w-[200px] max-h-[200px] rounded-lg border border-white/10 hover:border-[#A5D7E8]/50 transition-all shadow-xl" 
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-[#576CBC]/50 italic text-center py-4">No comments yet. Be the first to comment!</p>
        )}
      </div>

      <div className="relative">
        {/* Mention List Dropdown */}
        {showMentionList && (
          <div className="absolute bottom-full left-0 mb-3 w-72 bg-[#0B2447]/95 backdrop-blur-xl border border-[#576CBC]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-200">
            <div className="px-4 py-3 border-b border-[#576CBC]/10 bg-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black text-[#A5D7E8] uppercase tracking-[0.2em]">Mention Team</span>
              <span className="text-[9px] text-[#576CBC]/60 font-bold uppercase tracking-widest">Select one</span>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar p-1.5">
              {Object.values(membersMap)
                .filter(m => m.fullName.toLowerCase().includes(mentionQuery.toLowerCase()))
                .map(m => (
                  <button
                    key={m.userId}
                    onClick={() => handleMentionSelect(m.userId, m.fullName)}
                    className="w-full flex items-center gap-3 p-2.5 hover:bg-[#A5D7E8]/10 rounded-xl transition-all text-left group/item"
                  >
                    <div className="relative">
                      {m.profileImage ? (
                        <img src={m.profileImage} alt={m.fullName} className="w-9 h-9 rounded-full border border-[#576CBC]/20 group-hover/item:border-[#A5D7E8]/50 transition-colors" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#19376D] flex items-center justify-center text-[10px] font-black text-[#A5D7E8] border border-[#576CBC]/20 group-hover/item:border-[#A5D7E8]/50 transition-colors">
                          {m.fullName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0B2447] rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white group-hover/item:text-[#A5D7E8] transition-colors">{m.fullName}</span>
                      <span className="text-[10px] text-[#576CBC]/60 font-medium uppercase tracking-wider">{m.role || 'Member'}</span>
                    </div>
                  </button>
                ))}
              {Object.values(membersMap).filter(m => m.fullName.toLowerCase().includes(mentionQuery.toLowerCase())).length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-xs text-[#576CBC]/40 italic">No members found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Emoji Picker Popover */}
        {showEmojiPicker && (
          <div className="absolute bottom-full right-0 mb-2 p-3 bg-[#0B2447] border border-[#576CBC]/30 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-4 gap-2">
              {COMMON_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => insertEmoji(emoji)}
                  className="text-xl p-2 hover:bg-white/5 rounded-lg transition-all"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative group">
          {/* Attachment Previews */}
          {(attachments.length > 0 || isUploading) && (
            <div className="flex flex-wrap gap-2 mb-2 p-2 bg-white/[0.02] border border-white/5 rounded-lg">
              {attachments.map((url, idx) => (
                <div key={idx} className="relative group/att">
                  <img src={url} alt="preview" className="w-12 h-12 rounded object-cover border border-white/10" />
                  <button 
                    onClick={() => removeAttachment(idx)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/att:opacity-100 transition-all"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {isUploading && (
                <div className="w-12 h-12 rounded border border-white/10 flex items-center justify-center bg-white/5 animate-pulse">
                  <Loader2 size={16} className="text-[#A5D7E8] animate-spin" />
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={handleTextareaChange}
              placeholder="Add a comment... (use @ to mention)"
              className="w-full bg-[#19376D]/10 border border-[#576CBC]/20 rounded-xl p-3 pr-24 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#A5D7E8]/50 focus:bg-[#19376D]/20 transition-all resize-none min-h-[100px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !showMentionList) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              accept="image/*"
              onChange={handleFileChange}
            />

            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-2 rounded-lg transition-all ${showEmojiPicker ? "bg-[#A5D7E8] text-[#0B2447]" : "text-[#576CBC] hover:bg-white/5"}`}
                title="Add emoji"
              >
                <Smile size={18} />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`p-2 rounded-lg transition-all ${isUploading ? "opacity-50" : "text-[#576CBC] hover:bg-white/5"}`}
                title="Upload image"
              >
                <Paperclip size={18} />
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading || (!newComment.trim() && attachments.length === 0)}
                className="p-2 bg-[#A5D7E8] text-[#0B2447] rounded-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#A5D7E8]/10"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <p className="text-[10px] text-[#576CBC]/40 text-center uppercase tracking-widest font-black">
        Press Enter to post, Shift + Enter for new line • Use @ to mention team members
      </p>
    </div>
  );
}

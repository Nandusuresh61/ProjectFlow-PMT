import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type ReactNode } from "react";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

export interface WorkspaceMember {
  userId: string;
  fullName: string;
  email: string;
  role: WorkspaceRoleEnum;
  joinedAt: string;
  profileImage?: string | null;
}

const PROJECT_MODAL_OVERLAY_CLASS =
  "fixed inset-0 z-[120] bg-[#020817]/88 backdrop-blur-md";

const PROJECT_MODAL_PANEL_CLASS =
  "fixed z-[121] inset-x-3 top-3 bottom-3 sm:inset-x-6 sm:top-6 sm:bottom-6 xl:left-1/2 xl:top-1/2 xl:bottom-auto xl:w-full xl:max-w-5xl xl:-translate-x-1/2 xl:-translate-y-1/2 xl:max-h-[88vh] bg-[#050b16]/95 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.45)] overflow-hidden backdrop-blur-xl custom-scrollbar";

interface ProjectModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export const ProjectModalShell = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: ProjectModalShellProps) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={PROJECT_MODAL_OVERLAY_CLASS}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 20 }}
          transition={{ duration: 0.2 }}
          className={PROJECT_MODAL_PANEL_CLASS}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-white/8 px-5 py-5 sm:px-8 sm:py-6">
              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {title}
                </h3>
                <p className="text-[#8FA7D8]/65 font-medium text-sm mt-1 max-w-2xl">
                  {subtitle}
                </p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 p-2 hover:bg-white/5 rounded-xl text-white/40 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
              {children}
            </div>

            <div className="border-t border-white/8 bg-black/10 px-5 py-4 sm:px-8">
              {footer}
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

interface ProjectMemberPickerProps {
  members: WorkspaceMember[];
  selectedMemberIds: string[];
  loadingMembers: boolean;
  onToggleMember: (userId: string) => void;
}

export const ProjectMemberPicker = ({
  members,
  selectedMemberIds,
  loadingMembers,
  onToggleMember,
}: ProjectMemberPickerProps) => (
  <div>
    <div className="flex items-center justify-between mb-3 gap-4">
      <label className="block text-xs font-bold text-[#576CBC]/80 uppercase tracking-wider">
        Project Members
      </label>
      <span className="text-xs text-[#576CBC]/60 font-medium">
        {selectedMemberIds.length} selected
      </span>
    </div>

    <div className="rounded-[1.75rem] border border-white/5 bg-white/[0.02] p-3 max-h-[24rem] overflow-y-auto">
      {loadingMembers ? (
        <div className="px-4 py-10 text-sm text-center text-[#576CBC]/60">
          Loading workspace members...
        </div>
      ) : members.length === 0 ? (
        <div className="px-4 py-10 text-sm text-center text-[#576CBC]/60">
          No workspace members found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {members.map((member) => {
            const isSelected = selectedMemberIds.includes(member.userId);

            return (
              <button
                type="button"
                key={member.userId}
                onClick={() => onToggleMember(member.userId)}
                className={`w-full flex items-center gap-3 sm:gap-4 rounded-2xl px-3 sm:px-4 py-3 text-left border transition-all ${
                  isSelected
                    ? "border-[#A5D7E8]/40 bg-[#A5D7E8]/10 shadow-[0_0_0_1px_rgba(165,215,232,0.08)]"
                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#19376D] text-[#A5D7E8] flex items-center justify-center text-xs font-black overflow-hidden shrink-0">
                  {member.profileImage ? (
                    <img
                      src={member.profileImage}
                      alt={member.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    member.fullName.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p
                    className="text-sm font-bold text-white leading-tight break-words line-clamp-2 sm:line-clamp-1"
                    title={member.fullName}
                  >
                    {member.fullName}
                  </p>
                  <p
                    className="text-xs text-[#576CBC]/60 truncate"
                    title={member.email}
                  >
                    {member.email}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className="hidden md:inline text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#576CBC]/70 whitespace-nowrap">
                    {member.role === WorkspaceRoleEnum.WORKSPACE_OWNER
                      ? "Owner"
                      : member.role === WorkspaceRoleEnum.WORKSPACE_ADMIN
                        ? "Admin"
                        : "Member"}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                      isSelected
                        ? "border-[#A5D7E8] bg-[#A5D7E8] text-[#06101d]"
                        : "border-white/15 bg-transparent text-transparent"
                    }`}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

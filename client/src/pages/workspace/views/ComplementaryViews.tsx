import { Check, Zap, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";
import { toast } from "sonner";
import { CreateInvitationSchema } from "@/shared/schema/invitation/CreateInvitationSchema";
import { InviteMember } from "@/services/Invitation/invitation.api";
import { AuthUserState } from "@/store/auth.store";

export const PlaceholderView = ({ activeTab, setActiveTab }: any) => (
  <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
    <motion.div
      animate={{ rotate: 360, scale: [1, 1.05, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="w-40 h-40 bg-white/5 rounded-[4rem] border border-white/10 flex items-center justify-center text-[#A5D7E8]"
    >
      <Zap size={60} className="opacity-40" />
    </motion.div>
    <div>
      <h2 className="text-4xl font-black text-white capitalize tracking-tighter mb-4">
        {activeTab} Encrypted
      </h2>
      <p className="text-[#576CBC] max-w-md mx-auto font-medium text-lg leading-relaxed opacity-60">
        This area is currently being reconfigured with the latest command-link
        protocols.
      </p>
    </div>
    <button
      onClick={() => setActiveTab("dashboard")}
      className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all"
    >
      Return to Hub
    </button>
  </div>
);

export const InviteModal = ({ isOpen, onClose }: any) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WorkspaceRoleEnum>(WorkspaceRoleEnum.WORKSPACE_MEMBER);
  const [loading, setLoading] = useState(false);
  const currentWorkspaceId = AuthUserState(
    (state) => state.user?.currentWorkspaceId,
  );

  const handleInvite = async () => {
    // Zod validation
    const validation = CreateInvitationSchema.safeParse({ email, role });

    if (!validation.success) {
      const message = 
        validation.error.issues[0]?.message || "Invalid input";
      toast.error(message);
      return;
    }

    if (!currentWorkspaceId) {
      toast.error("Workspace not found!");
      return;
    }

    try {
      setLoading(true);

      const response = await InviteMember(currentWorkspaceId, {
        invites: [
          {
            email,
            role,
          },
        ],
      });
      toast.success(response.message || "Invitation Success");
      setEmail("");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#060c16] border border-white/10 rounded-[2.5rem] shadow-2xl z-[101] overflow-hidden backdrop-blur-xl"
          >
            <div className="p-6 sm:p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Invite Team Member
                  </h3>
                  <p className="text-[#576CBC]/60 font-medium text-sm mt-1">
                    Send an invitation to join your organization
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-xl text-white/40 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#576CBC]/80 mb-2 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="member@example.com"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#A5D7E8]/30 focus:bg-white/[0.08] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#576CBC]/80 mb-2 uppercase tracking-wider">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) =>
                        setRole(
                          e.target.value as
                          | WorkspaceRoleEnum.WORKSPACE_MEMBER
                          | WorkspaceRoleEnum.WORKSPACE_ADMIN,
                        )
                      }
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#A5D7E8]/30 focus:bg-white/[0.08] transition-all"
                    >
                      <option
                        value={WorkspaceRoleEnum.WORKSPACE_MEMBER}
                        className="bg-[#0B2447]"
                      >
                        Member
                      </option>
                      <option
                        value={WorkspaceRoleEnum.WORKSPACE_ADMIN}
                        className="bg-[#0B2447]"
                      >
                        Admin
                      </option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
                    />
                  </div>
                </div>

                {/* <div>
                  <label className="block text-xs font-bold text-[#576CBC]/80 mb-2 uppercase tracking-wider">
                    Message (Optional)
                  </label>
                  <textarea
                    placeholder="Welcome to the team!"
                    rows={3}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#A5D7E8]/30 focus:bg-white/[0.08] transition-all resize-none"
                  />
                </div> */}
              </div>

              <div className="mt-10 flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={loading}
                  className="flex-1 py-4 text-sm font-bold bg-[#A5D7E8] text-[#0B2447] rounded-2xl shadow-[0_0_20px_rgba(165,215,232,0.2)] hover:shadow-[0_0_25px_rgba(165,215,232,0.3)] hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                  {loading ? "Sending " : "Send Invitation"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const CreateWorkspaceModal = ({ isOpen, onClose }: any) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!workspaceName.trim()) {
      toast.error("Workspace name is required!");
      return;
    }
    try {
      setLoading(true);
      const { createWorkspace } = await import("@/services/workspace/workspace.api");
      const response = await createWorkspace({ workspaceName });
      toast.success(response.message || "Workspace Created!");
      
      setWorkspaceName("");
      onClose();
      
      const { useWorkspaceStore } = await import("@/store/workspace.store");
      const { AuthUserState } = await import("@/store/auth.store");
      
      const workspaceStore = useWorkspaceStore.getState();
      await workspaceStore.fetchWorkspaces();
      
      const authStore = AuthUserState.getState();
      if (authStore.user) {
          authStore.setUser({
              ...authStore.user,
              currentWorkspaceId: response.data!.workspaceId
          });
      }
      workspaceStore.setCurrentWorkspaceFromAuth(response.data!.workspaceId);
      
    } catch (error: any) {
      toast.error(error.message || "Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#060c16] border border-white/10 rounded-[2.5rem] shadow-2xl z-[101] overflow-hidden backdrop-blur-xl"
          >
            <div className="p-6 sm:p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Create Workspace
                  </h3>
                  <p className="text-[#576CBC]/60 font-medium text-sm mt-1">
                    Start a new workspace for your distinct projects.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-xl text-white/40 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#576CBC]/80 mb-2 uppercase tracking-wider">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="E.g. Acme Corp"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#A5D7E8]/30 focus:bg-white/[0.08] transition-all"
                  />
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="flex-1 py-4 text-sm font-bold bg-[#A5D7E8] text-[#0B2447] rounded-2xl shadow-[0_0_20px_rgba(165,215,232,0.2)] hover:shadow-[0_0_25px_rgba(165,215,232,0.3)] hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                  {loading ? "Creating... " : "Create Workspace"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface WorkspaceMember {
  userId: string;
  fullName: string;
  email: string;
  role: WorkspaceRoleEnum;
  joinedAt: string;
  profileImage?: string | null;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => Promise<void> | void;
}

const PROJECT_MODAL_OVERLAY_CLASS =
  "fixed inset-0 z-[120] bg-[#020817]/88 backdrop-blur-md";

const PROJECT_MODAL_PANEL_CLASS =
  "fixed z-[121] inset-x-3 top-3 bottom-3 sm:inset-x-6 sm:top-6 sm:bottom-6 xl:left-1/2 xl:top-1/2 xl:bottom-auto xl:w-full xl:max-w-5xl xl:-translate-x-1/2 xl:-translate-y-1/2 xl:max-h-[88vh] bg-[#050b16]/95 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.45)] overflow-hidden backdrop-blur-xl";

interface ProjectModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const ProjectModalShell = ({
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

const ProjectMemberPicker = ({
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

export const CreateProjectModal = ({
  isOpen,
  onClose,
  onCreated,
}: CreateProjectModalProps) => {
  const user = AuthUserState((state) => state.user);
  const currentWorkspaceId = user?.currentWorkspaceId;

  const [projectName, setProjectName] = useState("");
  const [projectKey, setProjectKey] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentUserRole = members.find(
    (member) => member.userId === user?.userId
  )?.role;
  const canCreateProject =
    currentUserRole === WorkspaceRoleEnum.WORKSPACE_OWNER ||
    currentUserRole === WorkspaceRoleEnum.WORKSPACE_ADMIN;

  useEffect(() => {
    if (!isOpen || !currentWorkspaceId) return;

    const fetchMembers = async () => {
      try {
        setLoadingMembers(true);
        const { getMembers } = await import("@/services/workspace/team.api");
        const response = await getMembers(currentWorkspaceId);
        setMembers(response.data ?? []);
      } catch (error: any) {
        toast.error(error.message || "Failed to load workspace members");
        setMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [isOpen, currentWorkspaceId]);

  useEffect(() => {
    if (!isOpen) {
      setProjectName("");
      setProjectKey("");
      setDescription("");
      setSelectedMemberIds([]);
      setMembers([]);
      setLoadingMembers(false);
      setSubmitting(false);
    }
  }, [isOpen]);

  const toggleMember = (userId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateProject = async () => {
    if (!currentWorkspaceId) {
      toast.error("Workspace not found");
      return;
    }

    if (!projectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!/^[A-Za-z]{2,3}$/.test(projectKey.trim())) {
      toast.error("Project key must be 2 to 3 letters");
      return;
    }

    if (!canCreateProject) {
      toast.error("Only workspace owner or admin can create projects");
      return;
    }

    try {
      setSubmitting(true);
      const { createProject } = await import("@/services/project/project.api");

      const response = await createProject({
        workspaceId: currentWorkspaceId,
        projectKey: projectKey.trim().toUpperCase(),
        name: projectName.trim(),
        description: description.trim() || null,
        memberIds: selectedMemberIds,
      });

      toast.success(response.message || "Project created successfully");
      await onCreated?.();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProjectModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Create Project"
      subtitle="Define the project and assign workspace members from the start."
      footer={
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateProject}
            disabled={submitting || loadingMembers || !canCreateProject}
            className="w-full sm:w-auto px-5 py-3 text-sm font-bold bg-[#A5D7E8] text-[#0B2447] rounded-2xl shadow-[0_0_20px_rgba(165,215,232,0.2)] hover:shadow-[0_0_25px_rgba(165,215,232,0.3)] hover:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Create Project"}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,1.1fr)] gap-6 xl:gap-8">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-white/6 bg-white/[0.02] p-5 sm:p-6">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#576CBC]/80 mb-2 uppercase tracking-wider">
                  Project Key
                </label>
                <input
                  type="text"
                  value={projectKey}
                  onChange={(e) =>
                    setProjectKey(
                      e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3)
                    )
                  }
                  placeholder="PF"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm uppercase tracking-[0.18em] text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#A5D7E8]/30 focus:bg-white/[0.08] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#576CBC]/80 mb-2 uppercase tracking-wider">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="E.g. Product Revamp"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#A5D7E8]/30 focus:bg-white/[0.08] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#576CBC]/80 mb-2 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this project about?"
                  rows={5}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#A5D7E8]/30 focus:bg-white/[0.08] transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {!loadingMembers && !canCreateProject && members.length > 0 && (
            <div className="rounded-2xl border border-amber-300/10 bg-amber-300/5 px-4 py-3 text-sm text-amber-100/80">
              Only workspace owners and admins can create projects.
            </div>
          )}
        </div>

        <ProjectMemberPicker
          members={members}
          selectedMemberIds={selectedMemberIds}
          loadingMembers={loadingMembers}
          onToggleMember={toggleMember}
        />
      </div>
    </ProjectModalShell>
  );
};

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    key: string;
    name: string;
    description: string | null;
    memberIds: string[];
  } | null;
  onUpdated?: () => Promise<void> | void;
}

export const EditProjectModal = ({
  isOpen,
  onClose,
  project,
  onUpdated,
}: EditProjectModalProps) => {
  const user = AuthUserState((state) => state.user);
  const currentWorkspaceId = user?.currentWorkspaceId;

  const [projectName, setProjectName] = useState("");
  const [projectKey, setProjectKey] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentUserRole = members.find(
    (member) => member.userId === user?.userId
  )?.role;
  const canEditProject =
    currentUserRole === WorkspaceRoleEnum.WORKSPACE_OWNER ||
    currentUserRole === WorkspaceRoleEnum.WORKSPACE_ADMIN;

  useEffect(() => {
    if (!isOpen || !project) return;

    setProjectName(project.name);
    setProjectKey(project.key);
    setDescription(project.description ?? "");
    setSelectedMemberIds(project.memberIds);
  }, [isOpen, project]);

  useEffect(() => {
    if (!isOpen || !currentWorkspaceId) return;

    const fetchMembers = async () => {
      try {
        setLoadingMembers(true);
        const { getMembers } = await import("@/services/workspace/team.api");
        const response = await getMembers(currentWorkspaceId);
        setMembers(response.data ?? []);
      } catch (error: any) {
        toast.error(error.message || "Failed to load workspace members");
        setMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [isOpen, currentWorkspaceId]);

  useEffect(() => {
    if (!isOpen) {
      setProjectName("");
      setProjectKey("");
      setDescription("");
      setSelectedMemberIds([]);
      setMembers([]);
      setLoadingMembers(false);
      setSubmitting(false);
    }
  }, [isOpen]);

  const toggleMember = (userId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleUpdateProject = async () => {
    if (!project) {
      toast.error("Project not found");
      return;
    }

    if (!projectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!/^[A-Za-z]{2,3}$/.test(projectKey.trim())) {
      toast.error("Project key must be 2 to 3 letters");
      return;
    }

    if (!canEditProject) {
      toast.error("Only workspace owner or admin can edit projects");
      return;
    }

    try {
      setSubmitting(true);
      const { updateProject } = await import("@/services/project/project.api");

      const response = await updateProject(project.id, {
        projectKey: projectKey.trim().toUpperCase(),
        name: projectName.trim(),
        description: description.trim() || null,
        memberIds: selectedMemberIds,
      });

      toast.success(response.message || "Project updated successfully");
      await onUpdated?.();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProjectModalShell
      isOpen={isOpen && Boolean(project)}
      onClose={onClose}
      title="Edit Project"
      subtitle="Update project details and adjust assigned members."
      footer={
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateProject}
            disabled={submitting || loadingMembers || !canEditProject}
            className="w-full sm:w-auto px-5 py-3 text-sm font-bold bg-[#A5D7E8] text-[#0B2447] rounded-2xl shadow-[0_0_20px_rgba(165,215,232,0.2)] hover:shadow-[0_0_25px_rgba(165,215,232,0.3)] hover:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,1.1fr)] gap-6 xl:gap-8">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-white/6 bg-white/[0.02] p-5 sm:p-6">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#576CBC]/80 mb-2 uppercase tracking-wider">
                  Project Key
                </label>
                <input
                  type="text"
                  value={projectKey}
                  onChange={(e) =>
                    setProjectKey(
                      e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3)
                    )
                  }
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm uppercase tracking-[0.18em] text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#A5D7E8]/30 focus:bg-white/[0.08] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#576CBC]/80 mb-2 uppercase tracking-wider">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#A5D7E8]/30 focus:bg-white/[0.08] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#576CBC]/80 mb-2 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#A5D7E8]/30 focus:bg-white/[0.08] transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {!loadingMembers && !canEditProject && members.length > 0 && (
            <div className="rounded-2xl border border-amber-300/10 bg-amber-300/5 px-4 py-3 text-sm text-amber-100/80">
              Only workspace owners and admins can edit projects.
            </div>
          )}
        </div>

        <ProjectMemberPicker
          members={members}
          selectedMemberIds={selectedMemberIds}
          loadingMembers={loadingMembers}
          onToggleMember={toggleMember}
        />
      </div>
    </ProjectModalShell>
  );
};

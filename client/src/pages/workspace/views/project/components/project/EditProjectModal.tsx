import { useEffect, useState } from "react";
import { toast } from "sonner";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";
import { AuthUserState } from "@/store/auth.store";
import { AppMessages } from "@/shared/messages/AppMessages";
import { ProjectModalShell, ProjectMemberPicker, type WorkspaceMember } from "./ProjectModalHelpers";

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
      toast.error(AppMessages.UNAUTHORIZED_PROJECT_EDIT);
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

      toast.success(response.message || AppMessages.PROJECT_UPDATED);
      await onUpdated?.();
      onClose();
    } catch (error: any) {
      toast.error(error.message || AppMessages.PROJECT_UPDATE_FAILED);
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

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { AppMessages } from "@/shared/messages/AppMessages";

export const CreateWorkspaceModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!workspaceName.trim()) {
      toast.error(AppMessages.WORKSPACE_NAME_REQUIRED);
      return;
    }
    try {
      setLoading(true);
      const { createWorkspace } = await import("@/services/workspace/workspace.api");
      const { useWorkspaceStore } = await import("@/store/workspace.store");
      const { AuthUserState } = await import("@/store/auth.store");

      const response = await createWorkspace({ workspaceName });
      toast.success(response.message || AppMessages.WORKSPACE_CREATED);
      
      setWorkspaceName("");
      onClose();
      
      const workspaceStore = useWorkspaceStore.getState();
      await workspaceStore.fetchWorkspaces();
      
      const authStore = AuthUserState.getState();
      if (authStore.user && response.data) {
          authStore.setUser({
              ...authStore.user,
              currentWorkspaceId: response.data.workspaceId
          });
          workspaceStore.setCurrentWorkspaceFromAuth(response.data.workspaceId);
      }
      
    } catch (error: any) {
      toast.error(error.message || AppMessages.WORKSPACE_CREATE_FAILED);
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

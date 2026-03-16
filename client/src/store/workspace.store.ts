import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WorkspaceData } from "@/services/workspace/workspace.api";
import { getUserWorkspaces, switchWorkspace } from "@/services/workspace/workspace.api";
import { AuthUserState } from "@/store/auth.store";

interface WorkspaceState {
  workspaces: WorkspaceData[];
  currentWorkspace: WorkspaceData | null;
  isLoading: boolean;
  
  fetchWorkspaces: () => Promise<void>;
  switchActiveWorkspace: (workspaceId: string) => Promise<boolean>;
  clearWorkspaceState: () => void;
  setCurrentWorkspaceFromAuth: (workspaceId: string | undefined) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspaces: [],
      currentWorkspace: null,
      isLoading: false,

      fetchWorkspaces: async () => {
        set({ isLoading: true });
        try {
          const response = await getUserWorkspaces();
          if (response.success && response.data) {
            set({ workspaces: response.data, isLoading: false });
            
            const authStore = AuthUserState.getState();
            if (authStore.user?.currentWorkspaceId) {
                get().setCurrentWorkspaceFromAuth(authStore.user.currentWorkspaceId);
            }
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          set({ isLoading: false });
          console.error("Failed to fetch workspaces", error);
        }
      },

      switchActiveWorkspace: async (workspaceId: string) => {
        try {
            const response = await switchWorkspace(workspaceId);
            if (response.success) {
                // Update auth store user object
                const authStore = AuthUserState.getState();
                if (authStore.user) {
                    authStore.setUser({
                        ...authStore.user,
                        currentWorkspaceId: workspaceId
                    });
                }

                get().setCurrentWorkspaceFromAuth(workspaceId);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to switch workspace", error);
            return false;
        }
      },

      setCurrentWorkspaceFromAuth: (workspaceId: string | undefined) => {
          if (!workspaceId) {
              set({ currentWorkspace: null });
              return;
          }
          const { workspaces } = get();
          const active = workspaces.find((w) => w.workspaceId === workspaceId);
          if (active) {
              set({ currentWorkspace: active });
          }
      },
      
      clearWorkspaceState: () => {
          set({
              workspaces: [],
              currentWorkspace: null,
              isLoading: false
          });
      }
    }),
    {
      name: "workspace-store",
      partialize: (state) => ({ currentWorkspace: state.currentWorkspace, workspaces: state.workspaces }),
    }
  )
);

import { X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";
import { toast } from "sonner";
import { CreateInvitationSchema } from "@/shared/schema/invitation/CreateInvitationSchema";
import { InviteMember } from "@/services/Invitation/invitation.api";
import { AuthUserState } from "@/store/auth.store";
import { AppMessages } from "@/shared/messages/AppMessages";
import { getErrorMessage } from "@/shared/utils/error";

export const InviteModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WorkspaceRoleEnum>(WorkspaceRoleEnum.WORKSPACE_MEMBER);
  const [loading, setLoading] = useState(false);
  const currentWorkspaceId = AuthUserState(
    (state) => state.user?.currentWorkspaceId,
  );

  const handleInvite = async () => {
    const validation = CreateInvitationSchema.safeParse({ email, role });

    if (!validation.success) {
      const message = 
        validation.error.issues[0]?.message || AppMessages.VALIDATION_FAILED;
      toast.error(message);
      return;
    }

    if (!currentWorkspaceId) {
      toast.error(AppMessages.WORKSPACE_NOT_FOUND);
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
      toast.success(response.message || AppMessages.INVITATION_SENT_SUCCESS);
      setEmail("");
      onClose();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || AppMessages.INVITATION_FAILED);
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

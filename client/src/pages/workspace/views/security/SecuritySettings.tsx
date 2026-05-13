import { useState } from "react";
import { Shield, Key } from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { changePassword } from "@/services/profile/changePassword.api";
import { toast } from "sonner";
import { ChangePasswordSchema } from "@/shared/schema/auth/ChangePasswordSchema";
import { getErrorMessage } from "@/shared/utils/error";

export const SecuritySettings = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSavePassword = async () => {
    try {
      if (form.newPassword !== form.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const result = ChangePasswordSchema.safeParse({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      if (!result.success) {
        toast.error(result.error.issues[0]?.message);
        return;
      }

      setLoading(true);

      const response = await changePassword(result.data);

      toast.success(response.message);

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setIsChangingPassword(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* Password Section */}
      <div className="border border-white/5 bg-white/[0.02] rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#A5D7E8]/10 rounded-xl flex items-center justify-center border border-[#A5D7E8]/20 text-[#A5D7E8]">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">Security</h3>
              <p className="text-[#576CBC]/60 text-sm mt-1">
                Manage your password and security settings
              </p>
            </div>
          </div>

          {!isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 border border-white/5"
            >
              <Key className="h-4 w-4" />
              Change Password
            </button>
          )}
        </div>

        {isChangingPassword && (
          <div className="animate-in slide-in-from-top-4 duration-300 fade-in pt-4 border-t border-white/5 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#576CBC]/80 uppercase tracking-wider">
                  Current Password
                </label>
                <PasswordInput
                  name="currentPassword"
                  placeholder="Enter current password"
                  onChange={handleChange}
                  className="bg-white/[0.03] border-white/5 rounded-xl h-12 text-white focus-visible:ring-1 focus-visible:ring-[#A5D7E8]/30 transition-all"
                />
              </div>
              <div className="hidden sm:block"></div> {/* Grid spacer */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#576CBC]/80 uppercase tracking-wider">
                  New Password
                </label>
                <PasswordInput
                  name="newPassword"
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="bg-white/[0.03] border-white/5 rounded-xl h-12 text-white focus-visible:ring-1 focus-visible:ring-[#A5D7E8]/30 transition-all"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#576CBC]/80 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <PasswordInput
                  name="confirmPassword"
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="bg-white/[0.03] border-white/5 rounded-xl h-12 text-white focus-visible:ring-1 focus-visible:ring-[#A5D7E8]/30 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4">
              <button
                onClick={() => setIsChangingPassword(false)}
                className="px-4 py-2 hover:bg-white/5 text-white/60 hover:text-white font-bold text-sm rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePassword}
                disabled={loading}
                className="px-6 py-2 bg-[#A5D7E8] text-[#0B2447] font-bold text-sm rounded-xl hover:shadow-[0_0_20px_rgba(165,215,232,0.3)] hover:bg-white transition-all"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

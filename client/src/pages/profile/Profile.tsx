import { useState } from "react";
import { User, Shield, Camera, Edit2, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";

export default function ProfileSettings() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Mock initial data
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
  });

  const handleSaveProfile = () => {
    // Save logic here
    setIsEditingProfile(false);
  };

  const handleSavePassword = () => {
    // Save password logic here
    setIsChangingPassword(false);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Profile Details Section */}
      <div className="border border-white/5 bg-white/[0.02] rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#A5D7E8]/10 rounded-xl flex items-center justify-center border border-[#A5D7E8]/20 text-[#A5D7E8]">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">Profile Details</h3>
              <p className="text-[#576CBC]/60 text-sm mt-1">Manage your personal information</p>
            </div>
          </div>
          
          {!isEditingProfile ? (
            <button 
              onClick={() => setIsEditingProfile(true)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 border border-white/5"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 hover:bg-white/5 text-white/60 hover:text-white font-bold text-sm rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-[#A5D7E8] text-[#0B2447] font-bold text-sm rounded-xl hover:shadow-[0_0_20px_rgba(165,215,232,0.3)] hover:bg-white transition-all"
              >
                Save
              </button>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Profile Photo - Only show advanced options when editing */}
          <div className="flex items-center gap-6">
            <div className={`relative ${isEditingProfile ? 'group cursor-pointer' : ''}`}>
              <div className="h-20 w-20 rounded-full border-2 border-white/10 bg-[#0B2447] flex items-center justify-center overflow-hidden">
                <span className="text-2xl font-bold text-white/50">JD</span>
              </div>
              {isEditingProfile && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Camera className="h-5 w-5 mb-1" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">Edit</span>
                </div>
              )}
            </div>
            
            {isEditingProfile ? (
              <div className="space-y-1">
                <p className="text-xs font-bold text-white/80">Profile Picture</p>
                <p className="text-xs text-[#576CBC]/60">JPEG, PNG under 5MB</p>
                <div className="pt-2 flex gap-2">
                  <button className="text-xs font-bold text-[#A5D7E8] hover:text-white transition-colors">Upload new</button>
                  <span className="text-white/20">•</span>
                  <button className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors">Remove</button>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-lg font-bold text-white">{profileData.fullName}</h4>
                <p className="text-sm text-[#576CBC]/80">{profileData.email}</p>
              </div>
            )}
          </div>

          {/* Form Fields - View / Edit Mode */}
          {isEditingProfile && (
            <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-white/5">
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#576CBC]/80 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <Input
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                    className="w-full bg-white/[0.03] border-white/5 rounded-xl pl-10 h-12 text-white focus-visible:ring-1 focus-visible:ring-[#A5D7E8]/30 transition-all"
                  />
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#576CBC]/60" />
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Password Section */}
      <div className="border border-white/5 bg-white/[0.02] rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#A5D7E8]/10 rounded-xl flex items-center justify-center border border-[#A5D7E8]/20 text-[#A5D7E8]">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">Security</h3>
              <p className="text-[#576CBC]/60 text-sm mt-1">Manage your password and security settings</p>
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
                <label className="text-xs font-bold text-[#576CBC]/80 uppercase tracking-wider">Current Password</label>
                <PasswordInput
                  placeholder="Enter current password"
                  className="bg-white/[0.03] border-white/5 rounded-xl h-12 text-white focus-visible:ring-1 focus-visible:ring-[#A5D7E8]/30 transition-all"
                />
              </div>
              
              <div className="hidden sm:block"></div> {/* Grid spacer */}

              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#576CBC]/80 uppercase tracking-wider">New Password</label>
                <PasswordInput
                  placeholder="Enter new password"
                  className="bg-white/[0.03] border-white/5 rounded-xl h-12 text-white focus-visible:ring-1 focus-visible:ring-[#A5D7E8]/30 transition-all"
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#576CBC]/80 uppercase tracking-wider">Confirm New Password</label>
                <PasswordInput
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
                className="px-6 py-2 bg-[#A5D7E8] text-[#0B2447] font-bold text-sm rounded-xl hover:shadow-[0_0_20px_rgba(165,215,232,0.3)] hover:bg-white transition-all"
              >
                Update Password
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

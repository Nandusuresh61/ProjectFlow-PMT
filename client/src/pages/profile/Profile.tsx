import { useState, useEffect } from "react";
import {
  User as UserIcon,
  Shield,
  Camera,
  Edit2,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { getProfile, updateProfile } from "@/services/profile/profile.api";
import type { User } from "@/types/auth.types";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import { UpdateUserProfileSchema } from "@/shared/schema/profile/UpdateUserProfileSchema";
import { useRef } from "react";
import { AuthUserState } from "@/store/auth.store";
import { getErrorMessage } from "@/shared/utils/error";

export default function ProfileSettings() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const checkAuth = AuthUserState((state) => state.checkAuth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        if (response.success && response.data) {
          setProfileData(response.data);
        } else {
          setError(response.message || "Failed to fetch profile");
        }
      } catch (err: unknown) {
        setError(getErrorMessage(err) || "An error occurred while fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      if (!profileData) return;

      setIsSaving(true);

      let imageUrl = profileData.profileImage;
      if (selectedImage) {
        toast.info("Uploading image...");
        try {
          imageUrl = await uploadToCloudinary(selectedImage);
        } catch {
          toast.error("Failed to upload image. Please try again.");
          setIsSaving(false);
          return;
        }
      }

      const payload = {
        fullName: profileData.fullName,
        profileImage: imageUrl,
      };

      const validatedData = UpdateUserProfileSchema.parse(payload);

      const response = await updateProfile(validatedData);

      if (response.success) {
        toast.success(response.message || "Profile updated successfully");
        setProfileData((prev) => prev ? { ...prev, ...payload, profileImage: imageUrl } : null);
        setIsEditingProfile(false);
        setSelectedImage(null);
        setImagePreview(null);
        await checkAuth();
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setProfileData((prev) => prev ? { ...prev, profileImage: "" } : null);
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 text-[#A5D7E8] animate-spin" />
        <p className="text-[#576CBC]/60 text-sm font-medium animate-pulse">
          Loading your profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 text-red-400">
          <Shield className="h-8 w-8" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-white font-bold text-lg">
            Failed to load profile
          </h3>
          <p className="text-[#576CBC]/60 text-sm max-w-xs">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl transition-all border border-white/5"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* Profile Details Section */}
      <div className="border border-white/5 bg-white/[0.02] rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#A5D7E8]/10 rounded-xl flex items-center justify-center border border-[#A5D7E8]/20 text-[#A5D7E8]">
              <UserIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">Profile Details</h3>
              <p className="text-[#576CBC]/60 text-sm mt-1">
                Manage your personal information
              </p>
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
                onClick={() => {
                  setIsEditingProfile(false);
                  setSelectedImage(null);
                  setImagePreview(null);
                  // Reset any unsaved changes by reading from API response or keeping old state
                  // For now simply cancelling keeps old unsaved data on next edit, 
                  // ideally you fetch profile again or store original state and revert it.
                }}
                disabled={isSaving}
                className="px-4 py-2 hover:bg-white/5 text-white/60 hover:text-white font-bold text-sm rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-4 py-2 bg-[#A5D7E8] text-[#0B2447] font-bold text-sm rounded-xl hover:shadow-[0_0_20px_rgba(165,215,232,0.3)] hover:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Profile Photo - Only show advanced options when editing */}
          <div className="flex items-center gap-6">
            <div
              className={`relative ${isEditingProfile ? "group cursor-pointer" : ""}`}
              onClick={() => isEditingProfile && fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/jpeg, image/png, image/webp"
              />
              <div className="h-20 w-20 rounded-full border-2 border-white/10 bg-[#0B2447] flex items-center justify-center overflow-hidden">
                {imagePreview || profileData?.profileImage ? (
                  <img
                    src={imagePreview || profileData?.profileImage || undefined}
                    alt={profileData?.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white/50">
                    {profileData?.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
              </div>
              {isEditingProfile && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Camera className="h-5 w-5 mb-1" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    Edit
                  </span>
                </div>
              )}
            </div>

            {isEditingProfile ? (
              <div className="space-y-1">
                <p className="text-xs font-bold text-white/80">
                  Profile Picture
                </p>
                <p className="text-xs text-[#576CBC]/60">JPEG, PNG under 5MB</p>
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-[#A5D7E8] hover:text-white transition-colors"
                  >
                    Upload new
                  </button>
                  <span className="text-white/20">•</span>
                  <button
                    onClick={handleRemoveImage}
                    className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-lg font-bold text-white">
                  {profileData?.fullName}
                </h4>
                <p className="text-sm text-[#576CBC]/80">
                  {profileData?.email}
                </p>
              </div>
            )}
          </div>

          {/* Form Fields - View / Edit Mode */}
          {isEditingProfile && (
            <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-white/5">
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#576CBC]/80 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <Input
                    value={profileData?.fullName || ""}
                    onChange={(e) =>
                      setProfileData((prev) =>
                        prev ? { ...prev, fullName: e.target.value } : null,
                      )
                    }
                    className="w-full bg-white/[0.03] border-white/5 rounded-xl pl-10 h-12 text-white focus-visible:ring-1 focus-visible:ring-[#A5D7E8]/30 transition-all"
                  />
                  <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-[#576CBC]/60" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

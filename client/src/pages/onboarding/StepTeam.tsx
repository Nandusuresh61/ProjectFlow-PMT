import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StepTeamProps } from "@/types/onboarding.types";
import { ArrowLeft } from "lucide-react";

export function StepTeam({ data, updateData, onBack, onFinish }: StepTeamProps) {
    const handleChange = (
        index: number,
        field: "email" | "role",
        value: string,
    ) => {
        const updated = [...data.teamMembers];
        updated[index] = { ...updated[index], [field]: value };
        updateData({ teamMembers: updated });
    };

    return (
        <div className="bg-[#19376D]/10 border border-[#576CBC]/20 rounded-[3rem] p-10 shadow-3xl backdrop-blur-3xl">
            <div className="space-y-4">
                {data.teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 items-end"
                    >
                        {/* Email Field */}
                        <div className="space-y-1">
                            <Label className="text-xs uppercase tracking-widest text-[#576CBC]/60 font-bold">
                                Email Address
                            </Label>
                            <Input
                                value={member.email}
                                onChange={(e) => handleChange(index, "email", e.target.value)}
                                placeholder="colleague@company.com"
                                className="h-12 rounded-xl bg-[#19376D]/10 border-[#576CBC]/20 
                   text-white placeholder:text-[#576CBC]/30
                   focus-visible:ring-[#A5D7E8]/30"
                            />
                        </div>

                        {/* Role Field */}
                        <div className="space-y-1">
                            <Label className="text-xs uppercase tracking-widest text-[#576CBC]/60 font-bold">
                                Role
                            </Label>

                            <div className="relative">
                                <select
                                    value={member.role}
                                    onChange={(e) => handleChange(index, "role", e.target.value)}
                                    className="h-12 w-full rounded-xl 
                     bg-[#19376D]/10 border border-[#576CBC]/20
                     text-white px-3 appearance-none
                     focus:outline-none focus:ring-1 focus:ring-[#A5D7E8]/30"
                                >
                                    <option value="WORKSPACE_ADMIN">Admin</option>
                                    <option value="WORKSPACE_MEMBER">Member</option>
                                    <option value="WORKSPACE_VIEWER">Viewer</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        updateData({
                            teamMembers: [
                                ...data.teamMembers,
                                { email: "", role: "WORKSPACE_MEMBER" },
                            ],
                        })
                    }
                    className="w-full border-dashed border-white/20 hover:bg-white/5 hover:border-white/30 text-[#A5D7E8] font-bold h-12 rounded-xl"
                >
                    + Add another member
                </Button>
            </div>

            <div className="mt-8 flex justify-between items-center">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-[#576CBC]/60 hover:text-white hover:bg-white/5 font-bold transition-all"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back
                </Button>

                <Button
                    onClick={onFinish}
                    className="bg-[#A5D7E8] text-[#0B2447] hover:bg-[#A5D7E8]/90 font-black px-10 h-12 rounded-xl uppercase tracking-wider shadow-lg"
                >
                    Finish Setup
                </Button>
            </div>
        </div>
    );
}

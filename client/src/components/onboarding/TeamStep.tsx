// features/onboarding/components/steps/TeamStep.tsx

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { TeamInvite } from "@/types/onboarding.types";

interface TeamStepProps {
  invites: TeamInvite[];
  onChange: (invites: TeamInvite[]) => void;
}

export function TeamStep({ invites, onChange }: TeamStepProps) {
  const [emailInput, setEmailInput] = useState("");

  const addInvite = () => {
    const trimmed = emailInput.trim();
    if (!trimmed || !trimmed.includes("@")) return;
    if (invites.some((i) => i.email === trimmed)) return; 
    onChange([...invites, { email: trimmed, role: "Member" }]);
    setEmailInput("");
  };

  const removeInvite = (email: string) => {
    onChange(invites.filter((i) => i.email !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInvite();
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto w-full">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Invite your team members</h2>
        <p className="text-slate-400 text-sm">ProjectFlow is better with your team</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <div className="space-y-2">
            <Label className="text-xs text-slate-400">Email Address</Label>
            <Input
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="colleague@company.com"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-white/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-slate-400">Role</Label>
            <div className="bg-white/5 border border-white/10 rounded-md h-10 px-3 flex items-center text-sm text-white">
              Member
            </div>
          </div>
        </div>

        {/* Added invites list */}
        {invites.length > 0 && (
          <ul className="space-y-2">
            {invites.map((invite) => (
              <li
                key={invite.email}
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
              >
                <span className="text-white">{invite.email}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-xs">{invite.role}</span>
                  <button
                    onClick={() => removeInvite(invite.email)}
                    className="text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={addInvite}
          className="w-full border-dashed border-white/20 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/40 h-12"
        >
          + Add another member
        </Button>
      </div>
    </div>
  );
}
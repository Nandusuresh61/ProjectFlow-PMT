// features/onboarding/components/steps/WorkspaceStep.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WorkspaceStepProps {
  value: string;
  onChange: (value: string) => void;
}

export function WorkspaceStep({ value, onChange }: WorkspaceStepProps) {
  return (
    <div className="space-y-6 max-w-md mx-auto w-full">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Name your workspace</h2>
        <p className="text-slate-400 text-sm">This is where your team will collaborate</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="workspaceName" className="text-slate-400">
          Workspace Name
        </Label>
        <Input
          id="workspaceName"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Acme Corp"
          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-white/20 h-12"
          autoFocus
        />
      </div>
    </div>
  );
}
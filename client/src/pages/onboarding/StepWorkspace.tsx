import { useState, useEffect } from "react";
import CustomForm, { type FormField } from "@/components/form/CustomForm";
import type { StepWorkspaceProps, WorkspaceValues } from "@/types/onboarding.types";
import { checkWorkspaceName } from "@/services/workspace/workspace.api";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";


export function StepWorkspace({ initialName, onSubmit }: StepWorkspaceProps) {
    const [name, setName] = useState(initialName);
    const [isChecking, setIsChecking] = useState(false);
    const [availabilityError, setAvailabilityError] = useState<string | undefined>(undefined);
    const [isAvailable, setIsAvailable] = useState(false);

    const workspaceRegex = /^[a-zA-Z0-9][a-zA-Z0-9 _-]{1,48}[a-zA-Z0-9]$/;

    useEffect(() => {
        if (!name || name.length < 3) {
            setAvailabilityError(undefined);
            setIsAvailable(false);
            setIsChecking(false);
            return;
        }

        if (!workspaceRegex.test(name)) {
            setAvailabilityError("Invalid workspace name format");
            setIsAvailable(false);
            setIsChecking(false);
            return;
        }

        const handler = setTimeout(async () => {
            setIsChecking(true);
            setAvailabilityError(undefined);
            setIsAvailable(false);

            try {
                const response = await checkWorkspaceName(name);
                if (response.data && !response.data.isAvailable) {
                    setAvailabilityError("A workspace with this name already exists");
                    setIsAvailable(false);
                } else {
                    setAvailabilityError(undefined);
                    setIsAvailable(true);
                }
            } catch (error: unknown) {
                setAvailabilityError("Failed to verify name availability");
            } finally {
                setIsChecking(false);
            }
        }, 600);

        return () => clearTimeout(handler);
    }, [name]);

    const workspaceFields: FormField<WorkspaceValues>[] = [
        {
            name: "workspaceName",
            label: "Workspace Name",
            type: "text",
            placeholder: "Acme Corp",
            inputClassName:
                "bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white/30 h-12",
            onChange: (val) => setName(val),
            customError: availabilityError,
            labelSuffix: (
                <div className="flex items-center gap-2">
                    {isChecking && <Loader2 className="h-4 w-4 animate-spin text-[#A5D7E8]" />}
                    {!isChecking && isAvailable && name.length >= 3 && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    )}
                    {!isChecking && availabilityError && (
                        <XCircle className="h-4 w-4 text-red-400" />
                    )}
                </div>
            )
        },
    ];

    return (
        <div className="bg-[#19376D]/10 border border-[#576CBC]/20 rounded-[3rem] p-10 shadow-3xl backdrop-blur-3xl">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
                    Workspace Setup
                </h2>
                <p className="text-[#576CBC]/60 font-medium">
                    Initialize your team's tactical interface.
                </p>
            </div>

            <CustomForm
                fields={workspaceFields}
                initialValues={{ workspaceName: initialName }}
                onSubmit={onSubmit}
                submitLabel="Continue"
                loadingLabel="Completing..."
                isLoading={isChecking}
                isDisabled={!isAvailable || isChecking || name.length < 3}
                submitClassName="w-fit ml-auto block bg-[#A5D7E8] text-[#0B2447] hover:bg-[#A5D7E8]/90 font-black px-10 h-12 rounded-xl uppercase tracking-wider shadow-lg disabled:opacity-50"
            />
        </div>
    );
}

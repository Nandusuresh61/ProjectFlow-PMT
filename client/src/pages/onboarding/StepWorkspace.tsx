import CustomForm, { type FormField } from "@/components/form/CustomFrom";
import type { StepWorkspaceProps, WorkspaceValues } from "@/types/onboarding.types";

const workspaceFields: FormField<WorkspaceValues>[] = [
    {
        name: "workspaceName",
        label: "Workspace Name",
        type: "text",
        placeholder: "Acme Corp",
        inputClassName:
            "bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white/30 h-12",
    },
];

export function StepWorkspace({ initialName, onSubmit }: StepWorkspaceProps) {
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
                loadingLabel="Validating..."
                submitClassName="w-fit ml-auto block bg-[#A5D7E8] text-[#0B2447] hover:bg-[#A5D7E8]/90 font-black px-10 h-12 rounded-xl uppercase tracking-wider shadow-lg"
            />
        </div>
    );
}

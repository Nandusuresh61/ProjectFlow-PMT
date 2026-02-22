import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GridBackground } from "@/components/ui/gridBackground";
import { Check, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { AuthUserState } from "@/store/auth.store";
import { completeOnboarding } from "@/services/onboarding/onboarding.api";
import { toast } from "sonner";
import { getPlans } from "@/services/plan/plan.api";
import type { Plan } from "@/types/plan.types";
import { Loader } from "@/components/ui/Loader";
import { Logo } from "@/components/common/Logo";
import CustomForm, { type FormField } from "@/components/form/CustomFrom";
import { BackgroundAtmosphere } from "../workspace/components/BaseComponents";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OnboardingState {
  workspaceName: string;
  planId: string;
  teamEmails: string[];
}

type WorkspaceValues = { workspaceName: string };

// ─── Step config ──────────────────────────────────────────────────────────────

const steps = [
  { id: 1, name: "Workspace" },
  { id: 2, name: "Plan" },
  { id: 3, name: "Team" },
];

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

const workspaceRegex = /^[a-zA-Z0-9][a-zA-Z0-9 _-]{1,48}[a-zA-Z0-9]$/;

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d < 0 ? 50 : -50, opacity: 0 }),
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [formData, setFormData] = useState<OnboardingState>({
    workspaceName: "",
    planId: "",
    teamEmails: [""],
  });

  const navigate = useNavigate();
  const user = AuthUserState((state) => state.user);

  useEffect(() => {
    if (user?.isOnboarded) navigate("/home");
  }, [user]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getPlans();
        setPlans(response.data);
      } catch {
        toast.error("Failed to load plans");
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const updateData = (data: Partial<OnboardingState>) =>
    setFormData((prev) => ({ ...prev, ...data }));

  const goNext = () => {
    setDirection(1);
    setCurrentStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentStep((s) => s - 1);
  };

  // ── Step 1 submit (via CustomForm) ────────────────────────────────────────
  const handleWorkspaceSubmit = async (values: WorkspaceValues) => {
    const name = values.workspaceName.trim();
    if (!workspaceRegex.test(name)) {
      toast.error(
        "Workspace must be 3–50 characters and contain only letters, numbers, spaces, - or _"
      );
      return;
    }
    updateData({ workspaceName: name });
    goNext();
  };

  // ── Step 3 finish ─────────────────────────────────────────────────────────
  const handleFinish = async () => {
    if (!formData.workspaceName.trim()) {
      toast.error("Workspace name is required");
      return;
    }
    if (!formData.planId) {
      toast.error("Please select a plan");
      return;
    }
    try {
      const response = await completeOnboarding({
        workspaceName: formData.workspaceName,
        planId: formData.planId,
      });

      if (!response.data) {
        toast.error("Failed to complete onboarding: No data received");
        return;
      }

      AuthUserState.setState((state) => ({
        user: {
          ...state.user!,
          isOnboarded: true,
          currentWorkspaceId: response.data!.workspaceId,
        },
      }));

      toast.success("Workspace created successfully 🎉");
      navigate("/home");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#060c16] text-white font-sans flex flex-col relative overflow-hidden selection:bg-[#A5D7E8] selection:text-[#0B2447]">
      <BackgroundAtmosphere />
      <GridBackground />

      <nav className="relative z-10 p-6 flex items-center justify-center">
        <Logo
          iconClassName="bg-[#A5D7E8] text-[#0B2447] shadow-[0_0_20px_rgba(165,215,232,0.2)]"
          textClassName="text-white"
        />
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 relative z-10 w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex flex-col items-center"
        >
          {/* Stepper */}
          <div className="w-full max-w-md mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -z-10" />
            <div className="flex justify-between items-center w-full">
              {steps.map((step) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                return (
                  <div key={step.id} className="flex flex-col items-center gap-2 bg-[#060c16] px-2">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-all duration-300",
                        isCompleted
                          ? "bg-[#A5D7E8] border-[#A5D7E8] text-[#0B2447]"
                          : isCurrent
                            ? "bg-[#060c16] border-[#A5D7E8] text-[#A5D7E8] shadow-[0_0_15px_rgba(165,215,232,0.3)]"
                            : "bg-[#060c16] border-[#576CBC]/20 text-[#576CBC]/40"
                      )}
                    >
                      {isCompleted ? <Check size={14} /> : step.id}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-bold uppercase tracking-wider transition-colors duration-300",
                        isCurrent || isCompleted ? "text-white" : "text-[#576CBC]/40"
                      )}
                    >
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
            <motion.div
              className="absolute top-1/2 left-0 h-[1px] bg-[#A5D7E8] -z-10 origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: (currentStep - 1) / (steps.length - 1) }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ width: "100%" }}
            />
          </div>

          {/* Step content */}
          <div className="w-full max-w-2xl min-h-[400px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "anticipate" }}
                className="w-full"
              >
                {currentStep === 1 && (
                  <StepWorkspace
                    initialName={formData.workspaceName}
                    onSubmit={handleWorkspaceSubmit}
                  />
                )}
                {currentStep === 2 && (
                  <StepPlan
                    data={formData}
                    plans={plans}
                    loading={plansLoading}
                    updateData={updateData}
                    onNext={goNext}
                    onBack={goBack}
                  />
                )}
                {currentStep === 3 && (
                  <StepTeam
                    data={formData}
                    updateData={updateData}
                    onBack={goBack}
                    onFinish={handleFinish}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// ─── Step 1: Workspace ────────────────────────────────────────────────────────

interface StepWorkspaceProps {
  initialName: string;
  onSubmit: (values: WorkspaceValues) => Promise<void>;
}

function StepWorkspace({ initialName, onSubmit }: StepWorkspaceProps) {
  return (
    <div className="bg-[#19376D]/10 border border-[#576CBC]/20 rounded-[3rem] p-10 shadow-3xl backdrop-blur-3xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Workspace Setup</h2>
        <p className="text-[#576CBC]/60 font-medium">Initialize your team's tactical interface.</p>
      </div>

      <CustomForm
        fields={workspaceFields}
        initialValues={{ workspaceName: initialName }}
        onSubmit={onSubmit}
        submitLabel="Continue"
        loadingLabel="Validating..."
        submitClassName="bg-[#A5D7E8] text-[#0B2447] hover:bg-[#A5D7E8]/90 font-black h-12 rounded-xl uppercase tracking-wider"
      />
    </div>
  );
}

// ─── Step 2: Plan ─────────────────────────────────────────────────────────────

interface StepPlanProps {
  data: OnboardingState;
  plans: Plan[];
  loading: boolean;
  updateData: (data: Partial<OnboardingState>) => void;
  onNext: () => void;
  onBack: () => void;
}

function StepPlan({ data, plans, loading, updateData, onNext, onBack }: StepPlanProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Select mission plan</h2>
        <p className="text-[#576CBC]/60 font-medium">Power protocols tailored to your needs.</p>
      </div>

      {loading ? (
        <Loader text="Loading plans..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans
            ?.filter((plan) => plan.isActive)
            .map((plan) => (
              <div
                key={plan.planId}
                onClick={() => updateData({ planId: plan.planId })}
                className={cn(
                  "relative cursor-pointer rounded-[2.5rem] border p-6 transition-all duration-300 hover:-translate-y-1 backdrop-blur-3xl",
                  data.planId === plan.planId
                    ? "bg-[#19376D]/20 border-[#A5D7E8] shadow-[0_0_30px_rgba(165,215,232,0.1)]"
                    : "bg-[#19376D]/10 border-[#576CBC]/20 hover:border-[#576CBC]/40"
                )}
              >
                <h3 className="text-xl font-black uppercase tracking-tight mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-black text-[#A5D7E8]">₹{plan.priceMonthly}</span>
                  <span className="text-sm text-[#576CBC]/60 font-medium">/month</span>
                </div>
                <p className="text-xs text-[#576CBC]/60 font-medium mb-4">{plan.description}</p>
                <div className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-[#576CBC]/80 font-medium">
                      <Check size={14} className="text-[#A5D7E8]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="mt-8 flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="text-[#576CBC]/60 hover:text-white hover:bg-white/5 font-bold transition-all">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!data.planId}
          className="bg-[#A5D7E8] text-[#0B2447] hover:bg-[#A5D7E8]/90 font-black px-10 h-12 rounded-xl uppercase tracking-wider shadow-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

// ─── Step 3: Team ─────────────────────────────────────────────────────────────

interface StepTeamProps {
  data: OnboardingState;
  updateData: (data: Partial<OnboardingState>) => void;
  onBack: () => void;
  onFinish: () => void;
}

function StepTeam({ data, updateData, onBack, onFinish }: StepTeamProps) {
  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...data.teamEmails];
    newEmails[index] = value;
    updateData({ teamEmails: newEmails });
  };

  return (
    <div className="bg-[#19376D]/10 border border-[#576CBC]/20 rounded-[3rem] p-10 shadow-3xl backdrop-blur-3xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Invite your team</h2>
        <p className="text-[#576CBC]/60 font-medium">ProjectFlow is more powerful with your crew.</p>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {data.teamEmails.map((email: string, index: number) => (
          <div key={index} className="space-y-1">
            <Label htmlFor={`email-${index}`} className="text-[#576CBC]/60 font-bold text-xs uppercase tracking-widest">
              Email Address {index + 1}
            </Label>
            <Input
              id={`email-${index}`}
              value={email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              placeholder="colleague@company.com"
              className="bg-[#19376D]/10 border-[#576CBC]/20 text-white placeholder:text-[#576CBC]/20 focus-visible:ring-[#A5D7E8]/30 h-12 rounded-xl"
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => updateData({ teamEmails: [...data.teamEmails, ""] })}
          className="w-full border-dashed border-white/20 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/40"
        >
          + Add another member
        </Button>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="text-[#576CBC]/60 hover:text-white hover:bg-white/5 font-bold transition-all">
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

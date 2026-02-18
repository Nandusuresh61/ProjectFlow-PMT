import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GridBackground } from "@/components/ui/gridBackground";
import { Check, ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { AuthUserState } from "@/store/auth.store";
import { completeOnboarding } from "@/services/onboarding/onboarding.api";
import { toast } from "sonner";
import { getPlans } from "@/services/plan/plan.api";
import type { Plan } from "@/types/plan.types";
import { Loader } from "@/components/ui/Loader";

interface OnboardingState {
  workspaceName: string;
  planId: string;
  teamEmails: string[];
}

const steps = [
  { id: 1, name: "Workspace" },
  { id: 2, name: "Plan" },
  { id: 3, name: "Team" },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  const navigate = useNavigate();
  const [formData, setFormData] = useState<OnboardingState>({
    workspaceName: "",
    planId: "",
    teamEmails: [""],
  });

  const user = AuthUserState((state) => state.user);

  useEffect(() => {
    if (user?.isOnboarded) {
      navigate("/home");
    }
  }, [user]);

  const handleNext = () => {
    const isValid = validateStep();

    if (!isValid) return;

    if (currentStep < 3) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getPlans();
        setPlans(response.data);
      } catch (error) {
        toast.error("Failed to load plans");
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const workspaceRegex = /^[a-zA-Z0-9][a-zA-Z0-9 _-]{1,48}[a-zA-Z0-9]$/;

  const validateStep = () => {
    if (currentStep === 1) {
      const name = formData.workspaceName.trim();

      if (!name) {
        toast.error("Workspace name is required");
        return false;
      }

      if (!workspaceRegex.test(name)) {
        toast.error(
          "Workspace must be 3–50 characters and contain only letters, numbers, spaces, - or _",
        );
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.planId) {
        toast.error("Please select a plan");
        return false;
      }
    }

    return true;
  };

  const handleFinish = async () => {
    try {
      if (!formData.workspaceName.trim()) {
        toast.error("Workspace name is required");
        return;
      }

      if (!formData.planId) {
        toast.error("Please select a plan");
        return;
      }

      const response = await completeOnboarding({
        workspaceName: formData.workspaceName,
        planId: formData.planId,
      });

      if (!response.data) {
        toast.error("Failed to complete onboarding: No data received");
        return;
      }

      const organizationId = response.data.organizationId;

      AuthUserState.setState((state) => ({
        user: {
          ...state.user!,
          isOnboarded: true,
          currentOrganizationId: organizationId,
        },
      }));

      toast.success("Workspace created successfully 🎉");

      navigate("/home");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
      <GridBackground />

      {/* Navbar - Simplified for Onboarding */}
      <nav className="relative z-10 p-6 flex items-center justify-center">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <div className="bg-white text-black w-8 h-8 flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            PF
          </div>
          <span className="text-white">ProjectFlow</span>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 relative z-10 w-full max-w-4xl mx-auto">
        {/* Progress Stepper */}
        <div className="w-full max-w-md mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -z-10" />
          <div className="flex justify-between items-center w-full">
            {steps.map((step) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center gap-2 bg-black px-2"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-all duration-300",
                      isCompleted
                        ? "bg-white border-white text-black"
                        : isCurrent
                          ? "bg-black border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                          : "bg-black border-white/20 text-slate-500",
                    )}
                  >
                    {isCompleted ? <Check size={14} /> : step.id}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium transition-colors duration-300",
                      isCurrent || isCompleted
                        ? "text-white"
                        : "text-slate-500",
                    )}
                  >
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Active Progress Bar Line - Optional Visual Enhancement */}
          <motion.div
            className="absolute top-1/2 left-0 h-[1px] bg-white -z-10 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: (currentStep - 1) / (steps.length - 1) }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ width: "100%" }}
          />
        </div>

        {/* Content Area */}
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
                  data={formData}
                  updateData={(data) => setFormData({ ...formData, ...data })}
                  onNext={handleNext}
                />
              )}
              {currentStep === 2 && (
                <StepPlan
                  data={formData}
                  plans={plans}
                  loading={plansLoading}
                  updateData={(data) => setFormData({ ...formData, ...data })}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {currentStep === 3 && (
                <StepTeam
                  data={formData}
                  updateData={(data) => setFormData({ ...formData, ...data })}
                  onBack={handleBack}
                  onFinish={handleFinish}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Steps Components ---

interface StepWorkspaceProps {
  data: OnboardingState;
  updateData: (data: Partial<OnboardingState>) => void;
  onNext: () => void;
}

function StepWorkspace({ data, updateData, onNext }: StepWorkspaceProps) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">
          Tell us about your workspace
        </h2>
        <p className="text-slate-400">
          Let's get your workspace set up correctly
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="workspaceName" className="text-slate-300">
            Workspace Name
          </Label>
          <Input
            id="workspaceName"
            value={data.workspaceName}
            onChange={(e) => updateData({ workspaceName: e.target.value })}
            placeholder="Acme Corp"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white/30 h-12"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={onNext}
          disabled={!data.workspaceName.trim()}
          className="bg-white text-black hover:bg-slate-200 font-bold px-8 h-12"
        >
          Continue
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Button>
      </div>
    </div>
  );
}

interface StepPlanProps {
  data: OnboardingState;
  plans: Plan[];
  loading: boolean;
  updateData: (data: Partial<OnboardingState>) => void;
  onNext: () => void;
  onBack: () => void;
}

function StepPlan({
  data,
  plans,
  loading,
  updateData,
  onNext,
  onBack,
}: StepPlanProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">
          Choose a plan that fits your needs
        </h2>
        <p className="text-slate-400">You can change this later at any time</p>
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
                  "relative cursor-pointer rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1",
                  data.planId === plan.planId
                    ? "bg-white/10 border-white ring-1 ring-white"
                    : "bg-[#0A0A0A] border-white/10 hover:border-white/30",
                )}
              >
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold">
                    ₹{plan.priceMonthly}
                  </span>
                  <span className="text-sm text-slate-500">/month</span>
                </div>

                <p className="text-xs text-slate-400 mb-4">
                  {plan.description}
                </p>

                <div className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-slate-300"
                    >
                      <Check size={14} className="text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="mt-8 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>

        <Button
          onClick={onNext}
          disabled={!data.planId}
          className="bg-white text-black hover:bg-slate-200 font-bold px-8 h-12"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

interface StepTeamProps {
  data: OnboardingState;
  updateData: (data: Partial<OnboardingState>) => void;
  onBack: () => void;
  onFinish: () => void;
}

function StepTeam({ data, updateData, onBack, onFinish }: StepTeamProps) {
  const addEmail = () => {
    updateData({ teamEmails: [...data.teamEmails, ""] });
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...data.teamEmails];
    newEmails[index] = value;
    updateData({ teamEmails: newEmails });
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Invite your team</h2>
        <p className="text-slate-400">
          ProjectFlow is better with your team involved
        </p>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {data.teamEmails.map((email: string, index: number) => (
          <div key={index} className="space-y-1">
            <Label htmlFor={`email-${index}`} className="text-slate-300">
              Email Address {index + 1}
            </Label>
            <Input
              id={`email-${index}`}
              value={email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              placeholder="colleague@company.com"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white/30"
            />
          </div>
        ))}
        <Button
          variant="outline"
          onClick={addEmail}
          className="w-full border-dashed border-white/20 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/40"
        >
          + Add another member
        </Button>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="text-slate-500 hover:text-white"
            onClick={() => console.log("Skipped")}
          >
            Skip for now
          </Button>
          <Button
            onClick={onFinish}
            className="bg-white text-black hover:bg-slate-200 font-bold px-8 h-12"
          >
            Finish Setup
          </Button>
        </div>
      </div>
    </div>
  );
}

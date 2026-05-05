import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { AuthUserState } from "@/store/auth.store";
import { completeOnboarding } from "@/services/onboarding/onboarding.api";
import { toast } from "sonner";
import { Logo } from "@/components/common/Logo";
import { GridBackground } from "@/components/ui/gridBackground";
import { BackgroundAtmosphere } from "../workspace/components/BackgroundAtmosphere";
import type {
  OnboardingState,
  WorkspaceValues,
} from "@/types/onboarding.types";

import { StepWorkspace } from "./StepWorkspace";
import { StepTeam } from "./StepTeam";

const steps = [
  { id: 1, name: "Workspace" },
  { id: 2, name: "Team" },
];



const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d < 0 ? 50 : -50, opacity: 0 }),
};

import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";
import { getErrorMessage } from "@/shared/utils/error";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [finishLoading, setFinishLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingState>({
    workspaceName: "",
    teamMembers: [{ email: "", role: WorkspaceRoleEnum.WORKSPACE_MEMBER }],
  });

  const navigate = useNavigate();
  const user = AuthUserState((state) => state.user);

  useEffect(() => {
    if (user && user.membershipCount > 0) {
      navigate("/home/dashboard");
    }
  }, [user, navigate]);


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

  const handleWorkspaceSubmit = async (values: WorkspaceValues) => {
    updateData({ workspaceName: values.workspaceName.trim() });
    goNext();
  };

  const handleFinish = async () => {
    if (!formData.workspaceName.trim()) {
      toast.error("Workspace name is required");
      return;
    }

    const validInvites = formData.teamMembers
      .filter((m) => m.email.trim() !== "")
      .map((m) => ({
        email: m.email,
        role: m.role,
      }));

    setFinishLoading(true);
    try {
      const response = await completeOnboarding({
        workspaceName: formData.workspaceName,
        invites: validInvites.length > 0 ? validInvites : undefined,
      });

      if (!response.data) {
        toast.error("Failed to create workspace");
        return;
      }

      const checkAuth = AuthUserState.getState().checkAuth;
      await checkAuth();

      toast.success("Workspace created successfully 🎉");
      navigate("/home/dashboard");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Failed to complete onboarding");
    } finally {
      setFinishLoading(false);
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

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-4 md:p-6 relative z-10 w-full max-w-4xl mx-auto">
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
                  <div
                    key={step.id}
                    className="flex flex-col items-center gap-2 bg-[#060c16] px-2"
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-all duration-300",
                        isCompleted
                          ? "bg-[#A5D7E8] border-[#A5D7E8] text-[#0B2447]"
                          : isCurrent
                            ? "bg-[#060c16] border-[#A5D7E8] text-[#A5D7E8] shadow-[0_0_15px_rgba(165,215,232,0.3)]"
                            : "bg-[#060c16] border-[#576CBC]/20 text-[#576CBC]/40",
                      )}
                    >
                      {isCompleted ? <Check size={14} /> : step.id}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-bold uppercase tracking-wider transition-colors duration-300",
                        isCurrent || isCompleted
                          ? "text-white"
                          : "text-[#576CBC]/40",
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
                  <StepTeam
                    data={formData}
                    updateData={updateData}
                    onBack={goBack}
                    onFinish={handleFinish}
                    isLoading={finishLoading}
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

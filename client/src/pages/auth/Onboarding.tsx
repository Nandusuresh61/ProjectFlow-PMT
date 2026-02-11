import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/gridBackground";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOnboarding } from "@/hooks/useOnboarding";
import { WorkspaceStep } from "@/components/onboarding/WorkspaceStep";
import { PlanStep } from "@/components/onboarding/PlanStep";
import { TeamStep } from "@/components/onboarding/TeamStep";


const steps = [
  { id: 1, name: "Workspace" },
  { id: 2, name: "Plan" },
  { id: 3, name: "Team" },
];

export default function Onboarding() {
  const {
    currentStep,
    formData,
    isSubmitting,
    isStepValid,
    updateForm,
    handleNext,
    handleBack,
    handleComplete,
  } = useOnboarding();

  const onContinue = () => {
    if (currentStep < 3) {
      handleNext();
    } else {
      handleComplete(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
      <GridBackground />

      {/* Minimal Nav */}
      <nav className="relative z-10 p-6 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tighter group"
        >
          <div className="bg-white text-black w-8 h-8 flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform">
            PF
          </div>
          <span className="text-white">ProjectFlow</span>
        </Link>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 relative z-10 w-full max-w-5xl mx-auto">
        {/* Stepper */}
        <div className="w-full max-w-md mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10 transform -translate-y-1/2" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-white transition-all duration-500 ease-in-out -z-10 transform -translate-y-1/2"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          <div className="flex justify-between w-full">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2",
                    currentStep >= step.id
                      ? "bg-white text-black border-white"
                      : "bg-black text-slate-500 border-white/20",
                  )}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors duration-300",
                    currentStep >= step.id ? "text-white" : "text-slate-500",
                  )}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl"
          >
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-sm min-h-[400px] flex flex-col justify-center">
              {currentStep === 1 && (
                <WorkspaceStep
                  value={formData.workspaceName}
                  onChange={(name) => updateForm({ workspaceName: name })}
                />
              )}
              {currentStep === 2 && (
                <PlanStep
                  selected={formData.plan}
                  onChange={(plan) => updateForm({ plan })}
                />
              )}
              {currentStep === 3 && (
                <TeamStep 
                  invites={formData.teamInvites}
                  onChange={(teamInvites) => updateForm({ teamInvites })}
                />
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={cn(
                    "text-slate-400 hover:text-white",
                    currentStep === 1 && "invisible",
                  )}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                <div className="flex items-center gap-4">
                  {currentStep === 3 && (
                    <Button
                      variant="ghost"
                      onClick={() => handleComplete(true)}
                      disabled={isSubmitting}
                      className="text-slate-400 hover:text-white"
                    >
                      Skip for now
                    </Button>
                  )}
                  <Button
                    onClick={onContinue}
                    disabled={!isStepValid() || isSubmitting}
                    className="bg-white text-black hover:bg-slate-200 font-bold px-8 disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Setting up..."
                      : currentStep === 3
                        ? "Complete Setup"
                        : "Continue"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
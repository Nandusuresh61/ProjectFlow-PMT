import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GridBackground } from "@/components/ui/gridBackground";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Workspace" },
  { id: 2, name: "Plan" },
  { id: 3, name: "Team" },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    workspaceName: "",
    plan: "free",
    teamEmail: "",
    role: "Member",
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      console.log("Onboarding completed:", formData);
      navigate("/home"); // Or wherever appropriate
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Skip logic if needed, for now just go next or finish
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
      <GridBackground />

      {/* Navbar Minimal */}
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
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
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
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
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
                <div className="space-y-6 max-w-md mx-auto w-full">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Name your workspace</h2>
                    <p className="text-slate-400 text-sm">
                      This is where your team will collaborate
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workspaceName" className="text-slate-400">
                      Workspace Name
                    </Label>
                    <Input
                      id="workspaceName"
                      value={formData.workspaceName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          workspaceName: e.target.value,
                        })
                      }
                      placeholder="Acme Corp"
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-white/20 h-12"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8 w-full">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">
                      Choose a plan that fits your needs
                    </h2>
                    <p className="text-slate-400 text-sm">
                      You can change this later at any time
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      {
                        name: "Free",
                        price: "$0",
                        features: [
                          "Up to 5 projects",
                          "Up to 10 team members",
                          "Basic support",
                        ],
                      },
                      {
                        name: "Pro",
                        price: "$99",
                        features: [
                          "Up to 25 projects",
                          "Up to 50 team members",
                          "Priority support",
                          "Advanced analytics",
                        ],
                        popular: true,
                      },
                      {
                        name: "Enterprise",
                        price: "$299",
                        features: [
                          "Unlimited projects",
                          "Unlimited team members",
                          "24/7 dedicated support",
                          "Custom integrations",
                          "SLA guarantee",
                        ],
                      },
                    ].map((plan) => (
                      <div
                        key={plan.name}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            plan: plan.name.toLowerCase(),
                          })
                        }
                        className={cn(
                          "relative border rounded-xl p-6 cursor-pointer transition-all hover:border-white/40 flex flex-col gap-4",
                          formData.plan === plan.name.toLowerCase()
                            ? "border-white bg-white/5"
                            : "border-white/10 bg-transparent",
                        )}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                            Most Popular
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg">{plan.name}</h3>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-3xl font-bold">
                              {plan.price}
                            </span>
                            <span className="text-slate-500 text-sm">/mo</span>
                          </div>
                          <p className="text-slate-400 text-xs mt-2">
                            {plan.name === "Free"
                              ? "For small teams just getting started"
                              : plan.name === "Pro"
                                ? "For growing teams that need more power"
                                : "For large organizations with specific needs"}
                          </p>
                        </div>
                        <ul className="space-y-2 flex-1">
                          {plan.features.map((feature, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-slate-300"
                            >
                              <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 max-w-lg mx-auto w-full">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">
                      Invite your team members
                    </h2>
                    <p className="text-slate-400 text-sm">
                      ProjectFlow is better with your team
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-[1fr_120px] gap-2">
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-400">
                          Email Address
                        </Label>
                        <Input
                          value={formData.teamEmail}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              teamEmail: e.target.value,
                            })
                          }
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

                    <Button
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/40 h-12"
                    >
                      + Add another member
                    </Button>
                  </div>
                </div>
              )}

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
                      onClick={handleSkip}
                      className="text-slate-400 hover:text-white"
                    >
                      Skip for now
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    className="bg-white text-black hover:bg-slate-200 font-bold px-8"
                  >
                    {currentStep === 3 ? "Complete Setup" : "Continue"}
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

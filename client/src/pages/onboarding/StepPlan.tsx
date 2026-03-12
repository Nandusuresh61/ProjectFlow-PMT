import { Button } from "@/components/ui/button";
import { Check, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/Loader";
import type { StepPlanProps } from "@/types/onboarding.types";



export function StepPlan({
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
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
                    Select mission plan
                </h2>
                <p className="text-[#576CBC]/60 font-medium">
                    Power protocols tailored to your needs.
                </p>
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
                                        : "bg-[#19376D]/10 border-[#576CBC]/20 hover:border-[#576CBC]/40",
                                )}
                            >
                                <h3 className="text-xl font-black uppercase tracking-tight mb-1">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-2xl font-black text-[#A5D7E8]">
                                        ₹{plan.priceMonthly}
                                    </span>
                                    <span className="text-sm text-[#576CBC]/60 font-medium">
                                        /month
                                    </span>
                                </div>
                                <p className="text-xs text-[#576CBC]/60 font-medium mb-4">
                                    {plan.description}
                                </p>
                                <div className="space-y-2">
                                    {plan.features.map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 text-sm text-[#576CBC]/80 font-medium"
                                        >
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
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-[#576CBC]/60 hover:text-white hover:bg-white/5 font-bold transition-all"
                >
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

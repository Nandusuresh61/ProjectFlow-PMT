// features/onboarding/components/steps/PlanStep.tsx

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Plan = "free" | "pro" | "enterprise";

interface PlanStepProps {
  selected: Plan;
  onChange: (plan: Plan) => void;
}

const plans = [
  {
    name: "Free" as const,
    value: "free" as Plan,
    price: "$0",
    description: "For small teams just getting started",
    features: ["Up to 5 projects", "Up to 10 team members", "Basic support"],
    available: true,
  },
  {
    name: "Pro" as const,
    value: "pro" as Plan,
    price: "$99",
    description: "For growing teams that need more power",
    features: ["Up to 25 projects", "Up to 50 team members", "Priority support", "Advanced analytics"],
    popular: true,
    available: false, // locked for now
  },
  {
    name: "Enterprise" as const,
    value: "enterprise" as Plan,
    price: "$299",
    description: "For large organizations with specific needs",
    features: ["Unlimited projects", "Unlimited team members", "24/7 dedicated support", "Custom integrations", "SLA guarantee"],
    available: false, // locked for now
  },
];

export function PlanStep({ selected, onChange }: PlanStepProps) {
  return (
    <div className="space-y-8 w-full">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose a plan that fits your needs</h2>
        <p className="text-slate-400 text-sm">You can change this later at any time</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.value}
            onClick={() => plan.available && onChange(plan.value)}
            className={cn(
              "relative border rounded-xl p-6 flex flex-col gap-4 transition-all",
              plan.available
                ? "cursor-pointer hover:border-white/40"
                : "cursor-not-allowed opacity-50",
              selected === plan.value
                ? "border-white bg-white/5"
                : "border-white/10 bg-transparent",
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            {!plan.available && (
              <div className="absolute -top-3 right-4 bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full">
                Coming Soon
              </div>
            )}
            <div>
              <h3 className="font-bold text-lg">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-slate-500 text-sm">/mo</span>
              </div>
              <p className="text-slate-400 text-xs mt-2">{plan.description}</p>
            </div>
            <ul className="space-y-2 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onboardingApi } from "@/services/onboarding/onboaring.api";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const [status, setStatus] = useState<"loading" | "complete" | "incomplete">("loading");

  useEffect(() => {
    onboardingApi
      .getStatus()
      .then((data) => setStatus(data.isCompleted ? "complete" : "incomplete"))
      .catch(() => setStatus("complete"));
  }, []);

  if (status === "loading") return null; 
  if (status === "incomplete") return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}
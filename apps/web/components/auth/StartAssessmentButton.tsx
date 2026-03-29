"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuthState } from "@/lib/auth";

export function StartAssessmentButton({
  className,
  size = "lg",
}: {
  className?: string;
  size?: "md" | "lg";
}) {
  const router = useRouter();
  const { authenticated } = useAuthState();

  return (
    <Button
      size={size}
      className={className}
      onClick={() => router.push(authenticated ? "/intake?new=1" : "/login")}
    >
      Start Assessment
    </Button>
  );
}

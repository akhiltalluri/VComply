import type { RiskLevel } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";

type RiskBadgeProps = {
  risk: RiskLevel;
};

export function RiskBadge({ risk }: RiskBadgeProps) {
  return (
    <Badge tone={risk === "HIGH" ? "high" : risk === "MEDIUM" ? "medium" : "low"}>
      {risk === "MEDIUM" ? "MED RISK" : `${risk} RISK`}
    </Badge>
  );
}

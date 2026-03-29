import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type RiskScoreCardProps = {
  score: number;
};

function getSeverity(score: number) {
  if (score >= 70) {
    return {
      label: "High",
      tone: "high" as const,
      border: "border-red-500/20",
      glow: "shadow-[0_24px_70px_rgba(127,29,29,0.14)]",
      accent: "text-red-300",
      track: "bg-red-500/10",
      fill: "bg-red-400",
      helper: "High regulatory exposure detected across current AI deployments.",
    };
  }

  if (score >= 30) {
    return {
      label: "Medium",
      tone: "medium" as const,
      border: "border-amber-500/20",
      glow: "shadow-[0_24px_70px_rgba(120,53,15,0.14)]",
      accent: "text-amber-300",
      track: "bg-amber-500/10",
      fill: "bg-amber-400",
      helper: "Several obligations require review before they become blockers.",
    };
  }

  return {
    label: "Low",
    tone: "low" as const,
    border: "border-emerald-500/20",
    glow: "shadow-[0_24px_70px_rgba(6,95,70,0.14)]",
    accent: "text-emerald-300",
    track: "bg-emerald-500/10",
    fill: "bg-emerald-400",
    helper: "Current controls indicate lower immediate regulatory pressure.",
  };
}

export function RiskScoreCard({ score }: RiskScoreCardProps) {
  const severity = getSeverity(score);

  return (
    <Card tone="subtle" className={`${severity.border} ${severity.glow} overflow-hidden p-7`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Overall Risk Score
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Weighted across laws, use cases, and deployment exposure.
          </p>
        </div>
        <Badge tone={severity.tone}>{severity.label}</Badge>
      </div>

      <div className="mt-10 flex items-end gap-3">
        <span className={`text-[5rem] font-semibold tracking-tight ${severity.accent}`}>
          {score}
        </span>
        <span className="pb-4 text-2xl font-medium text-slate-500">/100</span>
      </div>

      <div className={`mt-8 h-3 rounded-full ${severity.track}`}>
        <div
          className={`h-full rounded-full ${severity.fill}`}
          style={{ width: `${Math.max(8, Math.min(score, 100))}%` }}
        />
      </div>

      <p className="mt-6 text-base leading-7 text-slate-300">{severity.helper}</p>
    </Card>
  );
}

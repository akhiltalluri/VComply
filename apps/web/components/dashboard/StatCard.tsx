import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type StatCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  subtitle?: string;
};

export function StatCard({ title, children, className, subtitle }: StatCardProps) {
  return (
    <Card tone="subtle" className={cn("p-6", className)}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </h2>
      {subtitle ? <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p> : null}
      <div className="mt-5">{children}</div>
    </Card>
  );
}

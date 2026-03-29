import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  kicker?: string;
  className?: string;
};

export function SectionHeader({
  title,
  subtitle,
  align = "left",
  kicker,
  className,
}: SectionHeaderProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={cn(`flex flex-col gap-3 ${alignment}`, className)}>
      {kicker ? (
        <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {kicker}
        </span>
      ) : null}
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="max-w-3xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

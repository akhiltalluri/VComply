import { cn } from "@/lib/cn";
import { BrandMark } from "@/components/ui/BrandMark";

type BrandLockupProps = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  subtitle?: string;
  subtitleClassName?: string;
};

export function BrandLockup({
  className,
  markClassName,
  wordmarkClassName,
  subtitle,
  subtitleClassName,
}: BrandLockupProps) {
  return (
    <div className={cn("inline-flex items-center gap-4", className)}>
      <BrandMark className={markClassName} />
      <div className="min-w-0">
        <svg
          viewBox="0 0 208 32"
          aria-label="VComply"
          role="img"
          className={cn("h-8 w-auto text-white", wordmarkClassName)}
        >
          <text
            x="0"
            y="24"
            fill="currentColor"
            fontSize="24"
            fontWeight="700"
            letterSpacing="-0.8"
            fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          >
            VComply
          </text>
        </svg>
        {subtitle ? (
          <p className={cn("text-sm text-slate-400", subtitleClassName)}>{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

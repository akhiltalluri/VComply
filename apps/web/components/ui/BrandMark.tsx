type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center gap-1 text-sky-400 ${className}`}
    >
      <span className="h-6 w-2.5 rounded-full bg-current" />
      <span className="h-6 w-2.5 rounded-full bg-current" />
      <span className="h-6 w-2.5 rounded-full bg-current" />
    </span>
  );
}

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type PageContainerProps = HTMLAttributes<HTMLDivElement>;

export function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1600px] px-6 sm:px-8", className)} {...props}>
      {children}
    </div>
  );
}

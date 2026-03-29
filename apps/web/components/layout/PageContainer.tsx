import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type PageContainerProps = HTMLAttributes<HTMLDivElement>;

export function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1520px] px-5 sm:px-8 lg:px-10", className)} {...props}>
      {children}
    </div>
  );
}

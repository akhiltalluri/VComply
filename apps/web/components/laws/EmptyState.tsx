import { Button } from "@/components/ui/Button";
import { StatePanel } from "@/components/ui/StatePanel";

type EmptyStateProps = {
  onReset: () => void;
};

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <StatePanel
      title="No matching federal records available"
      description="Broaden the search criteria or clear one or more filters to restore the current federal legislative view."
      tone="warning"
      icon={
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.8]">
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </svg>
      }
      actions={
        <Button variant="secondary" onClick={onReset}>
          Clear filters
        </Button>
      }
    />
  );
}

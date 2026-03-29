import type { LawRecord } from "@/lib/mock-data";
import { LawCard } from "@/components/laws/LawCard";

type LawListProps = {
  laws: LawRecord[];
  selectedLawId: string;
  onSelectLaw: (lawId: string) => void;
};

export function LawList({ laws, selectedLawId, onSelectLaw }: LawListProps) {
  return (
    <div className="space-y-4">
      {laws.map((law) => (
        <LawCard
          key={law.id}
          law={law}
          selected={law.id === selectedLawId}
          onSelect={() => onSelectLaw(law.id)}
        />
      ))}
    </div>
  );
}

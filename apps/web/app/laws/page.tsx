"use client";

import { useMemo, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { FilterSidebar } from "@/components/laws/FilterSidebar";
import { LawDetailPanel } from "@/components/laws/LawDetailPanel";
import { LawList } from "@/components/laws/LawList";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { lawsData } from "@/lib/mock-data";

type SortMode = "risk" | "jurisdiction" | "name";

function riskOrder(risk: string) {
  if (risk === "HIGH") {
    return 3;
  }

  if (risk === "MEDIUM") {
    return 2;
  }

  return 1;
}

export default function LawsPage() {
  const [query, setQuery] = useState("");
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<string[]>([
    "New York",
    "California",
    "European Union",
  ]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>(["Hiring", "Profiling"]);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>(["HIGH", "MEDIUM", "LOW"]);
  const [selectedLawId, setSelectedLawId] = useState("nyc-ll-144");
  const [sortMode, setSortMode] = useState<SortMode>("risk");

  function toggleItem(current: string[], value: string) {
    return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
  }

  const filteredLaws = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const result = lawsData.filter((law) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        law.title.toLowerCase().includes(normalizedQuery) ||
        law.summary.toLowerCase().includes(normalizedQuery) ||
        law.jurisdiction.toLowerCase().includes(normalizedQuery) ||
        law.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
        law.useCases.some((useCase) => useCase.toLowerCase().includes(normalizedQuery));

      const matchesJurisdiction =
        selectedJurisdictions.length === 0 || selectedJurisdictions.includes(law.jurisdiction);

      const matchesUseCase =
        selectedUseCases.length === 0 ||
        law.useCases.some((useCase) => selectedUseCases.includes(useCase));

      const matchesRisk =
        selectedRiskLevels.length === 0 || selectedRiskLevels.includes(law.risk);

      return matchesQuery && matchesJurisdiction && matchesUseCase && matchesRisk;
    });

    return result.sort((a, b) => {
      if (sortMode === "jurisdiction") {
        return a.jurisdiction.localeCompare(b.jurisdiction);
      }

      if (sortMode === "name") {
        return a.title.localeCompare(b.title);
      }

      return riskOrder(b.risk) - riskOrder(a.risk);
    });
  }, [query, selectedJurisdictions, selectedRiskLevels, selectedUseCases, sortMode]);

  const selectedLaw =
    filteredLaws.find((law) => law.id === selectedLawId) ?? filteredLaws[0] ?? lawsData[0];

  const highRiskCount = useMemo(
    () => filteredLaws.filter((law) => law.risk === "HIGH").length,
    [filteredLaws]
  );

  return (
    <PageContainer className="space-y-8 pb-16 pt-8">
      <SectionHeader
        title="Regulatory Intelligence"
        subtitle="Search, filter, and inspect AI regulations across hiring, profiling, biometric systems, and governance use cases."
        className="max-w-5xl"
      />

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_420px]">
        <div className="xl:sticky xl:top-24 xl:self-start">
          <FilterSidebar
            selectedJurisdictions={selectedJurisdictions}
            selectedUseCases={selectedUseCases}
            selectedRiskLevels={selectedRiskLevels}
            onToggleJurisdiction={(value) =>
              setSelectedJurisdictions((current) => toggleItem(current, value))
            }
            onToggleUseCase={(value) => setSelectedUseCases((current) => toggleItem(current, value))}
            onToggleRiskLevel={(value) =>
              setSelectedRiskLevels((current) => toggleItem(current, value))
            }
          />
        </div>

        <div className="space-y-5">
          <Card tone="primary" className="space-y-5 p-5">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current stroke-[1.8]">
                  <circle cx="11" cy="11" r="6" fill="none" />
                  <path d="m16 16 4 4" fill="none" />
                </svg>
              </span>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Local Law 144, ADMT, biometric, hiring..."
                className="bg-slate-950 pl-12"
              />
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span>{filteredLaws.length} regulations found</span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />
                <span>{highRiskCount} high-risk items</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">Sort</span>
                <Select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                  className="min-w-[170px] bg-slate-950 py-2.5 text-sm"
                >
                  <option value="risk">Risk level</option>
                  <option value="jurisdiction">Jurisdiction</option>
                  <option value="name">Name</option>
                </Select>
              </div>
            </div>
          </Card>

          {filteredLaws.length > 0 ? (
            <LawList
              laws={filteredLaws}
              selectedLawId={selectedLaw.id}
              onSelectLaw={setSelectedLawId}
            />
          ) : (
            <Card tone="primary" className="p-8 text-center">
              <h2 className="text-xl font-semibold text-slate-100">No regulations found</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Try clearing a filter or searching for a broader jurisdiction or use case.
              </p>
              <div className="mt-5">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setQuery("");
                    setSelectedJurisdictions([]);
                    setSelectedUseCases([]);
                    setSelectedRiskLevels([]);
                  }}
                >
                  Reset filters
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div className="xl:sticky xl:top-24 xl:self-start">
          <LawDetailPanel law={selectedLaw} />
        </div>
      </div>
    </PageContainer>
  );
}

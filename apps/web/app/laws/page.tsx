"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { FilterSidebar } from "@/components/laws/FilterSidebar";
import { LawDetailPanel } from "@/components/laws/LawDetailPanel";
import { EmptyState } from "@/components/laws/EmptyState";
import { LawList } from "@/components/laws/LawList";
import { Card } from "@/components/ui/Card";
import { InsetPanel } from "@/components/ui/InsetPanel";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatePanel } from "@/components/ui/StatePanel";
import { Button } from "@/components/ui/Button";
import { getApiErrorMessage, getLaws } from "@/lib/api";
import { useAuthState } from "@/lib/auth";
import {
  buildLawApplicabilityExplanation,
  hydrateLawRecords,
  lawFilterOptions,
} from "@/lib/mock-data";
import { parseStoredJson } from "@/lib/storage";
import type { IntakeDraft, LawRecord } from "@/lib/mock-data";

type SortMode = "risk" | "jurisdiction" | "name";
type LawsPageState = "loading" | "ready" | "error";

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
  const router = useRouter();
  const { authenticated, ready: authReady } = useAuthState();
  const [pageState, setPageState] = useState<LawsPageState>("loading");
  const [lawsCatalog, setLawsCatalog] = useState<LawRecord[]>([]);
  const [fetchError, setFetchError] = useState("");
  const [intakeDraft, setIntakeDraft] = useState<IntakeDraft | null>(null);
  const [query, setQuery] = useState("");
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<string[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>([]);
  const [selectedEnforcementStages, setSelectedEnforcementStages] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLawId, setSelectedLawId] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("risk");

  useEffect(() => {
    const storedDraft = parseStoredJson<IntakeDraft>(
      localStorage.getItem("complianceIntakeDraft")
    );

    if (!storedDraft) {
      setIntakeDraft(null);
      return;
    }

    setIntakeDraft(storedDraft);
  }, []);

  const loadLaws = useCallback(async () => {
    setPageState("loading");
    setFetchError("");

    try {
      const apiLaws = await getLaws();
      const hydrated = hydrateLawRecords(apiLaws);

      if (hydrated.length === 0) {
        setLawsCatalog([]);
        setSelectedLawId("");
        setFetchError(
          "No federal legislative records are available yet. Run the Congress.gov ingest job to populate the laws library."
        );
        setPageState("ready");
        return;
      }

      setLawsCatalog(hydrated);
      setSelectedLawId((current) => current || hydrated[0]?.id || "");
      setPageState("ready");
    } catch (error) {
      setPageState("error");
      setFetchError(getApiErrorMessage(error, "Unable to load federal legislative records"));
    }
  }, []);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (!authenticated) {
      router.replace("/login");
      return;
    }

    void loadLaws();
  }, [authReady, authenticated, loadLaws, router]);

  function toggleItem(current: string[], value: string) {
    return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
  }

  const filteredLaws = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const result = lawsCatalog.filter((law) => {
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

      const matchesEnforcementStage =
        selectedEnforcementStages.length === 0 ||
        selectedEnforcementStages.includes(law.enforcementStage);

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(law.category);

      return (
        matchesQuery &&
        matchesJurisdiction &&
        matchesUseCase &&
        matchesRisk &&
        matchesEnforcementStage &&
        matchesCategory
      );
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
  }, [
    lawsCatalog,
    query,
    selectedCategories,
    selectedEnforcementStages,
    selectedJurisdictions,
    selectedRiskLevels,
    selectedUseCases,
    sortMode,
  ]);

  useEffect(() => {
    if (filteredLaws.length === 0) {
      return;
    }

    if (!filteredLaws.some((law) => law.id === selectedLawId)) {
      setSelectedLawId(filteredLaws[0].id);
    }
  }, [filteredLaws, selectedLawId]);

  const selectedLaw = filteredLaws.find((law) => law.id === selectedLawId) ?? filteredLaws[0] ?? null;
  const sourceLabel = selectedLaw?.sourceLabel ?? "Catalog source unavailable";

  const applicabilityExplanation = useMemo(
    () =>
      selectedLaw
        ? buildLawApplicabilityExplanation(selectedLaw, {
            companyName: intakeDraft?.company_name || "your company",
            states: intakeDraft?.states_of_operation
              ?.split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            usesAiInHiring: intakeDraft?.uses_ai_in_hiring,
            aiUseCases: [
              intakeDraft?.ai_use_cases,
              intakeDraft?.critical_use_cases,
              intakeDraft?.additional_context,
            ]
              .filter(Boolean)
              .join(", "),
            selectedCategories: intakeDraft?.selected_categories,
            jurisdictions: [selectedLaw.jurisdiction],
          })
        : "No company-specific applicability explanation is available for the current selection.",
    [intakeDraft, selectedLaw]
  );

  const highRiskCount = useMemo(
    () => filteredLaws.filter((law) => law.risk === "HIGH").length,
    [filteredLaws]
  );

  const activeEnforcementCount = useMemo(
    () =>
      filteredLaws.filter((law) =>
        [
          "Enacted Federal Law",
          "Passed Congress",
          "Advancing Through Congress",
          "Committee Review",
          "Introduced in Congress",
          "Active Legislative Process",
        ].includes(
          law.enforcementStage
        )
      ).length,
    [filteredLaws]
  );

  const activeFilterOptions = useMemo(
    () => ({
      jurisdictions:
        lawsCatalog.length > 0
          ? Array.from(new Set(lawsCatalog.map((law) => law.jurisdiction))).sort()
          : lawFilterOptions.jurisdictions,
      useCases:
        lawsCatalog.length > 0
          ? Array.from(new Set(lawsCatalog.flatMap((law) => law.useCases))).sort()
          : lawFilterOptions.useCases,
      riskLevels:
        lawsCatalog.length > 0
          ? Array.from(new Set(lawsCatalog.map((law) => law.risk)))
          : lawFilterOptions.riskLevels,
      enforcementStages:
        lawsCatalog.length > 0
          ? Array.from(new Set(lawsCatalog.map((law) => law.enforcementStage))).sort()
          : lawFilterOptions.enforcementStages,
      categories:
        lawsCatalog.length > 0
          ? Array.from(new Set(lawsCatalog.map((law) => law.category))).sort()
          : lawFilterOptions.categories,
    }),
    [lawsCatalog]
  );

  function resetFilters() {
    setQuery("");
    setSelectedJurisdictions([]);
    setSelectedUseCases([]);
    setSelectedRiskLevels([]);
    setSelectedEnforcementStages([]);
    setSelectedCategories([]);
  }

  if (!authReady || !authenticated || pageState === "loading") {
    return (
      <PageContainer className="flex min-h-[60vh] items-center pb-16 pt-8">
        <StatePanel
          title="Loading regulatory workspace"
          description="Confirming access and preparing the current regulation catalog."
          tone="info"
          icon={
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />
          }
        />
      </PageContainer>
    );
  }

  if (!selectedLaw && lawsCatalog.length === 0) {
    return (
      <PageContainer className="flex min-h-[60vh] items-center pb-16 pt-8">
        <StatePanel
          title="No federal legislative records available"
          description={
            fetchError ||
            "The laws library is empty right now. Run the Congress.gov ingest flow to populate federal legislative records."
          }
          tone={pageState === "error" ? "error" : "warning"}
          actions={
            <Button variant="secondary" onClick={() => void loadLaws()}>
              Retry
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-8 pb-16 pt-8">
      <SectionHeader
        title="Regulatory Intelligence"
        subtitle="Explore federal AI-related legislative records sourced from Congress.gov, understand the latest congressional status, and assess what each item could mean for your system."
        className="max-w-5xl"
      />

      <InsetPanel tone="blue" className="px-4 py-4">
        <p className="text-sm font-medium text-slate-100">
          {intakeDraft?.company_name
            ? `Use this workspace to explain the federal legislative exposure for ${intakeDraft.company_name}.`
            : "Use this workspace to review federal legislative records that may affect the current system profile."}
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-400">
          Search the Congress.gov-backed catalog, compare bill status, and open any record to review
          impact, rationale, and next-step monitoring guidance.
        </p>
      </InsetPanel>

      {fetchError ? (
        <InsetPanel tone="amber" className="px-4 py-4">
          <p className="text-sm font-medium text-amber-200">{fetchError}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button variant="secondary" size="md" onClick={() => void loadLaws()}>
              Retry Backend
            </Button>
          </div>
        </InsetPanel>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_420px]">
        <div className="xl:sticky xl:top-24 xl:self-start">
          <FilterSidebar
            jurisdictions={activeFilterOptions.jurisdictions}
            useCases={activeFilterOptions.useCases}
            riskLevels={activeFilterOptions.riskLevels}
            enforcementStages={activeFilterOptions.enforcementStages}
            categories={activeFilterOptions.categories}
            selectedJurisdictions={selectedJurisdictions}
            selectedUseCases={selectedUseCases}
            selectedRiskLevels={selectedRiskLevels}
            selectedEnforcementStages={selectedEnforcementStages}
            selectedCategories={selectedCategories}
            onToggleJurisdiction={(value) =>
              setSelectedJurisdictions((current) => toggleItem(current, value))
            }
            onToggleUseCase={(value) => setSelectedUseCases((current) => toggleItem(current, value))}
            onToggleRiskLevel={(value) =>
              setSelectedRiskLevels((current) => toggleItem(current, value))
            }
            onToggleEnforcementStage={(value) =>
              setSelectedEnforcementStages((current) => toggleItem(current, value))
            }
            onToggleCategory={(value) =>
              setSelectedCategories((current) => toggleItem(current, value))
            }
            onReset={resetFilters}
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
                placeholder="Search by regulation, workflow, jurisdiction, or compliance topic..."
                className="bg-slate-950 pl-12"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <InsetPanel>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Federal Records In View
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-100">{filteredLaws.length}</p>
              </InsetPanel>
              <InsetPanel tone={highRiskCount > 0 ? "red" : "green"}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  High-Risk Records
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-100">{highRiskCount}</p>
              </InsetPanel>
              <InsetPanel tone="blue">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Advanced Status
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-100">
                  {activeEnforcementCount}
                </p>
              </InsetPanel>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span>{filteredLaws.length} federal records in view</span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />
                <span>{highRiskCount} high-risk records</span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />
                <span>{sourceLabel}</span>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <span className="text-sm text-slate-500">Sort by</span>
                <Select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                  className="min-w-[170px] bg-slate-950 py-2.5 text-sm sm:min-w-[190px]"
                >
                  <option value="risk">Risk level</option>
                  <option value="jurisdiction">Jurisdiction</option>
                  <option value="name">Regulation name</option>
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
            <EmptyState onReset={resetFilters} />
          )}
        </div>

        <div className="xl:sticky xl:top-24 xl:self-start">
          {filteredLaws.length > 0 ? (
            <LawDetailPanel law={selectedLaw} applicabilityExplanation={applicabilityExplanation} />
          ) : (
            <StatePanel
              title="No regulation selected"
              description="No regulations match the current filters. Clear one or more filters to restore the regulatory detail panel."
              tone="warning"
              actions={
                <Button variant="secondary" onClick={resetFilters}>
                  Clear filters
                </Button>
              }
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}

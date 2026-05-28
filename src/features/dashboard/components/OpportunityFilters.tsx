"use client";

import type { ReactElement } from "react";

import type { Opportunity, OpportunityCategory } from "@/features/dashboard/schemas";

interface OpportunityFiltersProps {
  search: string;
  category: OpportunityCategory | "all";
  location: string;
  skill: string;
  opportunities: Opportunity[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSkillChange: (value: string) => void;
  onClearFilters?: () => void;
  onMatchToggle?: () => void;
  matchActive?: boolean;
}

const CATEGORY_LABELS: Record<OpportunityCategory, string> = {
  educational: "تعليمي",
  health: "صحي",
  environmental: "بيئي",
  social: "اجتماعي",
};

export function OpportunityFilters({
  search,
  category,
  location,
  skill,
  opportunities,
  onSearchChange,
  onCategoryChange,
  onLocationChange,
  onSkillChange,
  onClearFilters,
  onMatchToggle,
  matchActive,
}: OpportunityFiltersProps): ReactElement {
  const locationOptions = Array.from(
    new Set(opportunities.map((item) => item.location.trim()).filter((item) => item.length > 0)),
  );

  const skillOptions = Array.from(
    new Set(
      opportunities
        .flatMap((item) => item.requiredSkills)
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
    ),
  );

  

  return (
    <div className="mx-auto w-full max-w-7xl px-6">
      <div className="relative -mt-8">
        <div className="rounded-2xl input-surface border border-border-soft p-3 shadow-md backdrop-blur-sm flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1 min-w-0">
            <label htmlFor="search" className="sr-only">
              ابحث عن فرصة
            </label>
            <div className="relative">
              <input
                id="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="اكتب اسم الفرصة أو المجال أو الموقع"
                className={
                  "w-full rounded-md bg-transparent pr-10 text-sm text-foreground placeholder:text-text-secondary outline-none" +
                  ""
                }
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="M20 20L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <select
              id="category"
              value={category}
              onChange={(event) => onCategoryChange(event.target.value)}
              className="input-surface appearance-none pr-8 text-sm"
            >
              <option value="all">كل التصنيفات</option>
              <option value="educational">{CATEGORY_LABELS.educational}</option>
              <option value="health">{CATEGORY_LABELS.health}</option>
              <option value="environmental">{CATEGORY_LABELS.environmental}</option>
              <option value="social">{CATEGORY_LABELS.social}</option>
            </select>

            <select
              id="location"
              value={location}
              onChange={(event) => onLocationChange(event.target.value)}
              className="input-surface appearance-none pr-8 text-sm"
            >
              <option value="">كل المواقع</option>
              {locationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              id="skill"
              value={skill}
              onChange={(event) => onSkillChange(event.target.value)}
              className="input-surface appearance-none pr-8 text-sm"
            >
              <option value="">كل المهارات</option>
              {skillOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => onClearFilters && onClearFilters()}
              className="text-sm text-text-secondary hover:text-foreground"
            >
              مسح
            </button>

            <button
              type="button"
              onClick={() => onMatchToggle && onMatchToggle()}
              className={`inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition ${
                matchActive ? "bg-accent text-white" : "border border-accent text-accent"
              }`}
            >
              {matchActive ? "مطابقة مفعّلة" : "مطابقة مهاراتي"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

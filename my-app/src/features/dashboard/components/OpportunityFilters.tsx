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

  const inputClassName =
    "h-11 w-full rounded-lg border border-border-soft bg-surface px-3 text-sm text-foreground placeholder:text-text-secondary outline-none transition-colors focus:border-2 focus:border-accent";

  return (
    <section className="flex flex-col gap-6 rounded-xl border border-border-soft bg-surface p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-2">
        <label htmlFor="search" className="text-sm font-semibold text-foreground">
          ابحث عن فرصة
        </label>
        <div className="relative overflow-hidden rounded-xl border border-emerald-300/70 bg-gradient-to-l from-emerald-100/80 via-white to-emerald-50/70 p-3 shadow-[0_8px_24px_rgba(16,185,129,0.12)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_50%,rgba(16,185,129,0.2),transparent_45%)]" />
          <div className="absolute inset-y-2 right-2 left-2 rounded-lg border border-emerald-200/80 bg-surface/90 backdrop-blur-sm" />
          <input
            id="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="اكتب اسم الفرصة أو المجال أو الموقع"
            className={
              inputClassName +
              " relative pr-10 bg-surface text-foreground placeholder:text-text-secondary"
            }
          />
          <svg
            className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary"
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

      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="text-sm font-medium text-foreground">
            التصنيف
          </label>
          <select
            id="category"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className={inputClassName}
          >
            <option value="all">كل التصنيفات</option>
            <option value="educational">{CATEGORY_LABELS.educational}</option>
            <option value="health">{CATEGORY_LABELS.health}</option>
            <option value="environmental">{CATEGORY_LABELS.environmental}</option>
            <option value="social">{CATEGORY_LABELS.social}</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="location" className="text-sm font-medium text-foreground">
            الموقع
          </label>
          <select
            id="location"
            value={location}
            onChange={(event) => onLocationChange(event.target.value)}
            className={inputClassName}
          >
            <option value="">كل المواقع</option>
            {locationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="skill" className="text-sm font-medium text-foreground">
            المهارة المطلوبة
          </label>
          <select
            id="skill"
            value={skill}
            onChange={(event) => onSkillChange(event.target.value)}
            className={inputClassName}
          >
            <option value="">كل المهارات</option>
            {skillOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

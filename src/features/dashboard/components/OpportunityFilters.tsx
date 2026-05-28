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

  const chipClass =
    "inline-flex items-center gap-2 rounded-md border border-border-soft bg-surface px-3 py-1 text-sm text-foreground";

  return (
    <section className="flex flex-col gap-6 rounded-xl border border-border-soft bg-surface p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-2">
        <label htmlFor="search" className="text-sm font-semibold text-foreground">
          ابحث عن فرصة
        </label>
        <div className="relative rounded-lg border border-border-soft bg-surface p-2">
          <div className="flex items-center gap-2">
            <input
              id="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="اكتب اسم الفرصة أو المجال أو الموقع"
              className={inputClassName + " relative pr-10 bg-surface text-foreground placeholder:text-text-secondary"}
            />
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="inline-flex h-10 items-center justify-center rounded-md px-3 text-sm text-text-secondary hover:text-foreground"
              aria-label="مسح البحث"
            >
              مسح
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <span className={chipClass}>الفلاتر</span>
          <span className={chipClass}>مرتب حسب: الأحدث</span>
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
          <div className="flex items-center gap-2">
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
            <button
              type="button"
              onClick={() => onSkillChange("")}
              className="inline-flex h-10 items-center justify-center rounded-md border border-border-soft px-3 text-sm text-text-secondary hover:text-foreground"
            >
              مسح
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

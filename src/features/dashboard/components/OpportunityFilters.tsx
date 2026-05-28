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
      <div className="relative -mt-4">
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
                  "w-full rounded-lg bg-white/60 h-12 pr-12 pl-4 text-base text-foreground placeholder:text-text-secondary outline-none border border-transparent focus:border-emerald-200 focus:ring-2 focus:ring-emerald-100 transition"
                }
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary"
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
            {/* Category dropdown (hover) */}
            <div className="relative group">
              <button
                type="button"
                className="input-surface rounded-lg px-3 py-2 flex items-center gap-2 text-sm min-w-[10rem] justify-between"
                aria-haspopup="listbox"
              >
                <span>{category === "all" ? "كل التصنيفات" : CATEGORY_LABELS[category]}</span>
                <svg className="h-4 w-4 text-text-secondary" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M5 8l5 4 5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <ul
                role="listbox"
                className="absolute z-50 right-0 mt-2 w-48 rounded-md bg-white border border-gray-100 shadow-lg py-1 hidden group-hover:block"
              >
                <li
                  role="option"
                  tabIndex={0}
                  onClick={() => onCategoryChange("all")}
                  className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                >
                  <span>كل التصنيفات</span>
                  <span className="opacity-0 hover:opacity-100 text-gray-400">›</span>
                </li>
                <li
                  role="option"
                  tabIndex={0}
                  onClick={() => onCategoryChange("educational")}
                  className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                >
                  <span>{CATEGORY_LABELS.educational}</span>
                  <span className="opacity-0 hover:opacity-100 text-gray-400">›</span>
                </li>
                <li
                  role="option"
                  tabIndex={0}
                  onClick={() => onCategoryChange("health")}
                  className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                >
                  <span>{CATEGORY_LABELS.health}</span>
                  <span className="opacity-0 hover:opacity-100 text-gray-400">›</span>
                </li>
                <li
                  role="option"
                  tabIndex={0}
                  onClick={() => onCategoryChange("environmental")}
                  className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                >
                  <span>{CATEGORY_LABELS.environmental}</span>
                  <span className="opacity-0 hover:opacity-100 text-gray-400">›</span>
                </li>
                <li
                  role="option"
                  tabIndex={0}
                  onClick={() => onCategoryChange("social")}
                  className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                >
                  <span>{CATEGORY_LABELS.social}</span>
                  <span className="opacity-0 hover:opacity-100 text-gray-400">›</span>
                </li>
              </ul>
            </div>

            {/* Location dropdown (hover) */}
            <div className="relative group">
              <button
                type="button"
                className="input-surface rounded-lg px-3 py-2 flex items-center gap-2 text-sm min-w-[10rem] justify-between"
                aria-haspopup="listbox"
              >
                <span>{location.length === 0 ? "كل المواقع" : location}</span>
                <svg className="h-4 w-4 text-text-secondary" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M5 8l5 4 5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <ul role="listbox" className="absolute z-50 right-0 mt-2 w-56 rounded-md bg-white border border-gray-100 shadow-lg py-1 hidden group-hover:block max-h-60 overflow-auto">
                <li className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between" onClick={() => onLocationChange("")}>كل المواقع <span className="opacity-0 hover:opacity-100 text-gray-400">›</span></li>
                {locationOptions.map((option) => (
                  <li
                    key={option}
                    className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                    onClick={() => onLocationChange(option)}
                    role="option"
                    tabIndex={0}
                  >
                    <span className="truncate">{option}</span>
                    <span className="opacity-0 hover:opacity-100 text-gray-400">›</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skill dropdown (hover) */}
            <div className="relative group">
              <button
                type="button"
                className="input-surface rounded-lg px-3 py-2 flex items-center gap-2 text-sm min-w-[10rem] justify-between"
                aria-haspopup="listbox"
              >
                <span>{skill.length === 0 ? "كل المهارات" : skill}</span>
                <svg className="h-4 w-4 text-text-secondary" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M5 8l5 4 5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <ul role="listbox" className="absolute z-50 right-0 mt-2 w-56 rounded-md bg-white border border-gray-100 shadow-lg py-1 hidden group-hover:block max-h-60 overflow-auto">
                <li className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between" onClick={() => onSkillChange("")}>كل المهارات <span className="opacity-0 hover:opacity-100 text-gray-400">›</span></li>
                {skillOptions.map((option) => (
                  <li
                    key={option}
                    className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                    onClick={() => onSkillChange(option)}
                    role="option"
                    tabIndex={0}
                  >
                    <span className="truncate">{option}</span>
                    <span className="opacity-0 hover:opacity-100 text-gray-400">›</span>
                  </li>
                ))}
              </ul>
            </div>

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

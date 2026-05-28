"use client";

import { HeartHandshake } from "lucide-react";
import type { ReactElement } from "react";
import { useDeferredValue, useMemo, useState } from "react";

import { AnnouncementBanner } from "@/features/dashboard/components/AnnouncementBanner";
import { AdBanner } from "@/features/dashboard/components/AdBanner";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { OpportunityFilters } from "@/features/dashboard/components/OpportunityFilters";
import { OpportunityList } from "@/features/dashboard/components/OpportunityList";
import { OpportunityRequestForm } from "@/features/dashboard/components/OpportunityRequestForm";
import {
  useActiveAnnouncement,
  useDashboardOpportunities,
  useMyProfile,
  useNotifications,
} from "@/features/dashboard/hooks";
import {
  OpportunityCategorySchema,
  type Opportunity,
  type OpportunityCategory,
} from "@/features/dashboard/schemas";

const DEFAULT_PAGE_SIZE = 12;

const matchesLocalFilters = (
  opportunity: Opportunity,
  category: OpportunityCategory | "all",
  location: string,
): boolean => {
  const matchesCategory = category === "all" || opportunity.category === category;
  const matchesLocation =
    location.length === 0 ||
    opportunity.location.toLocaleLowerCase().includes(location.toLocaleLowerCase());

  return matchesCategory && matchesLocation;
};

export function DashboardClient(): ReactElement {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<OpportunityCategory | "all">("all");
  const [location, setLocation] = useState("");
  const [skill, setSkill] = useState("");
  const [filterByProfileSkills, setFilterByProfileSkills] = useState(false);

  const deferredSearch = useDeferredValue(search);
  const opportunitiesQuery = useDashboardOpportunities({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    search: deferredSearch,
    skill,
  });
  const notificationsQuery = useNotifications();
  const profileQuery = useMyProfile();
  const activeAnnouncementQuery = useActiveAnnouncement();

  const unreadNotificationsCount = useMemo(() => {
    const list = notificationsQuery.data ?? [];
    return list.filter((item) => !item.isRead).length;
  }, [notificationsQuery.data]);

  const userSkills = useMemo(() => {
    const list = profileQuery.data?.skills ?? [];
    return list
      .map((item) => item.trim().toLocaleLowerCase())
      .filter((item) => item.length > 0);
  }, [profileQuery.data?.skills]);

  const filteredOpportunities = useMemo(() => {
    const list = opportunitiesQuery.data?.data ?? [];
    const locallyFiltered = list.filter((item) => matchesLocalFilters(item, category, location));

    if (!filterByProfileSkills || userSkills.length === 0) {
      return locallyFiltered;
    }

    return locallyFiltered.filter((item) => {
      const requiredSkills = item.requiredSkills.map((skillItem) =>
        skillItem.trim().toLocaleLowerCase(),
      );

      return requiredSkills.some((requiredSkill) =>
        userSkills.some(
          (userSkill) =>
            requiredSkill.includes(userSkill) || userSkill.includes(requiredSkill),
        ),
      );
    });
  }, [opportunitiesQuery.data?.data, category, location, filterByProfileSkills, userSkills]);

  const handleCategoryChange = (value: string): void => {
    if (value === "all") {
      setCategory("all");
      return;
    }

    const parsed = OpportunityCategorySchema.safeParse(value);
    if (parsed.success) {
      setCategory(parsed.data);
    }
  };

  return (
    <>
      <DashboardHeader unreadNotificationsCount={unreadNotificationsCount} />

      <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
        <section className="flex flex-col gap-8">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-xl bg-surface p-6 sm:p-8 border border-border-soft shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
            <div className="absolute top-0 left-0 h-full w-1.5 bg-accent" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
                  <HeartHandshake className="h-7 w-7 text-accent" />
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                    لوحة الفرص التطوعية
                  </h1>
                  <p className="max-w-lg text-base leading-relaxed text-text-secondary">
                    استعرض فرص التطوع المتاحة بسهولة، وابحث بسرعة، ثم صف النتائج حسب المجال
                    والموقع والمهارات.
                  </p>
                </div>
              </div>
              <OpportunityRequestForm variant="hero" />
            </div>
          </div>

          <div className="mt-3">
            <AdBanner />
          </div>

          <div className="relative -mt-10 z-30">
            <OpportunityFilters
              search={search}
              category={category}
              location={location}
              skill={skill}
              opportunities={opportunitiesQuery.data?.data ?? []}
              onSearchChange={setSearch}
              onCategoryChange={handleCategoryChange}
              onLocationChange={setLocation}
              onSkillChange={setSkill}
              matchActive={filterByProfileSkills}
              onMatchToggle={() => setFilterByProfileSkills((c) => !c)}
              onClearFilters={() => {
                setSearch("");
                setCategory("all");
                setLocation("");
                setSkill("");
                setFilterByProfileSkills(false);
              }}
            />
          </div>

          {opportunitiesQuery.isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              تعذر جلب الفرص من الخادم. حاول مرة أخرى.
            </div>
          ) : null}

          <div>
            {opportunitiesQuery.isPending ? (
              <div className="rounded-xl border border-border-soft bg-surface p-8 text-center text-sm text-text-secondary">
                جارٍ تحميل الفرص...
              </div>
            ) : (
              <OpportunityList opportunities={filteredOpportunities} />
            )}
          </div>
        </section>
      </main>
    </>
  );
}

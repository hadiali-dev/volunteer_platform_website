import type { ReactElement } from "react";

import { OpportunityCard } from "@/features/dashboard/components/OpportunityCard";
import type { Opportunity } from "@/features/dashboard/schemas";

interface OpportunityListProps {
  opportunities: Opportunity[];
}

export function OpportunityList({ opportunities }: OpportunityListProps): ReactElement {
  if (opportunities.length === 0) {
    return (
      <div className="rounded-xl border border-border-soft bg-surface p-8 text-center">
        <h3 className="text-xl font-semibold text-foreground">لا توجد فرص مطابقة</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          جرّب تعديل البحث أو الفلاتر لعرض فرص تطوعية أخرى.
        </p>
      </div>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {opportunities.map((opportunity) => (
        <OpportunityCard key={opportunity._id} opportunity={opportunity} />
      ))}
    </section>
  );
}

import type { ReactElement } from "react";

import type { ApplicationStatus } from "@/features/dashboard/schemas";

interface MyApplicationsFiltersProps {
  status: ApplicationStatus | "all";
  pendingCount: number;
  acceptedCount: number;
  rejectedCount: number;
  onStatusChange: (status: ApplicationStatus | "all") => void;
}

interface StatusOption {
  value: ApplicationStatus | "all";
  label: string;
  count: number;
}

export function MyApplicationsFilters({
  status,
  pendingCount,
  acceptedCount,
  rejectedCount,
  onStatusChange,
}: MyApplicationsFiltersProps): ReactElement {
  const options: StatusOption[] = [
    {
      value: "all",
      label: "كل الطلبات",
      count: pendingCount + acceptedCount + rejectedCount,
    },
    { value: "pending", label: "قيد المراجعة", count: pendingCount },
    { value: "accepted", label: "مقبول", count: acceptedCount },
    { value: "rejected", label: "مرفوض", count: rejectedCount },
  ];

  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50/20 p-6 shadow-[0_6px_18px_rgba(33,37,41,0.08)]">
      <p className="text-sm font-semibold text-foreground">تصفية حسب حالة الطلب</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = status === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onStatusChange(option.value)}
              className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
                isActive
                  ? "bg-accent text-white shadow-[0_8px_18px_rgba(40,167,115,0.25)]"
                  : "border border-emerald-200 bg-white text-emerald-800 hover:border-accent hover:text-accent"
              }`}
            >
              <span>{option.label}</span>
              <span
                className={`inline-flex min-w-6 justify-center rounded-md px-1.5 text-xs ${
                  isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                }`}
              >
                {option.count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}



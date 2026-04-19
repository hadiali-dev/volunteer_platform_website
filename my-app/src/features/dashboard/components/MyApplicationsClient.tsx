"use client";

import type { ReactElement } from "react";
import { useMemo, useState } from "react";

import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { MyApplicationsFilters } from "@/features/dashboard/components/MyApplicationsFilters";
import { MyApplicationsList } from "@/features/dashboard/components/MyApplicationsList";
import {
  useMyApplications,
  useMyApplicationsStatusCounts,
  useNotifications,
} from "@/features/dashboard/hooks";
import type { ApplicationStatus } from "@/features/dashboard/schemas";

const PAGE_SIZE = 9;

export function MyApplicationsClient(): ReactElement {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ApplicationStatus | "all">("all");

  const notificationsQuery = useNotifications();
  const applicationsQuery = useMyApplications({ page, limit: PAGE_SIZE, status });
  const statusCountsQuery = useMyApplicationsStatusCounts();

  const unreadNotificationsCount = useMemo(() => {
    const list = notificationsQuery.data ?? [];
    return list.filter((item) => !item.isRead).length;
  }, [notificationsQuery.data]);

  const applications = useMemo(() => {
    return applicationsQuery.data?.data ?? [];
  }, [applicationsQuery.data?.data]);

  const counts = statusCountsQuery.data ?? {
    pending: 0,
    accepted: 0,
    rejected: 0,
    all: 0,
  };

  const total = applicationsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleStatusChange = (nextStatus: ApplicationStatus | "all"): void => {
    setStatus(nextStatus);
    setPage(1);
  };

  return (
    <>
      <DashboardHeader unreadNotificationsCount={unreadNotificationsCount} />

      <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <section className="grid grid-cols-12 gap-8">
          <div className="col-span-12 grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                طلباتي
              </h1>
              <button
                type="button"
                onClick={() => void applicationsQuery.refetch()}
                disabled={applicationsQuery.isFetching}
                className="inline-flex h-10 items-center rounded-lg border border-emerald-200 bg-emerald-50/30 px-4 text-sm font-semibold text-emerald-700 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-55"
              >
                {applicationsQuery.isFetching ? "جاري التحديث..." : "تحديث الحالة"}
              </button>
            </div>
            <p className="text-base leading-8 text-text-secondary">
              راجع جميع طلباتك التطوعية واطلع على حالة كل طلب بسهولة.
            </p>
          </div>

          <div className="col-span-12">
            <MyApplicationsFilters
              status={status}
              pendingCount={counts.pending}
              acceptedCount={counts.accepted}
              rejectedCount={counts.rejected}
              onStatusChange={handleStatusChange}
            />
          </div>

          {applicationsQuery.isError ? (
            <div className="col-span-12 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-[0_8px_20px_rgba(220,38,38,0.08)]">
              تعذر جلب الطلبات من الخادم. حاول مرة أخرى.
            </div>
          ) : null}

          <div className="col-span-12">
            {applicationsQuery.isPending ? (
              <div className="rounded-2xl border border-border-soft bg-surface p-8 text-center text-sm text-text-secondary shadow-[0_6px_18px_rgba(33,37,41,0.08)]">
                جارٍ تحميل طلباتك...
              </div>
            ) : (
              <MyApplicationsList applications={applications} />
            )}
          </div>

          {totalPages > 1 ? (
            <div className="col-span-12 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1}
                className="inline-flex h-10 items-center rounded-lg border border-emerald-200 bg-emerald-50/30 px-4 text-sm font-semibold text-emerald-700 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-55"
              >
                السابق
              </button>
              <p className="text-sm font-semibold text-emerald-700">
                صفحة {page} من {totalPages}
              </p>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page >= totalPages}
                className="inline-flex h-10 items-center rounded-lg border border-emerald-200 bg-emerald-50/30 px-4 text-sm font-semibold text-emerald-700 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-55"
              >
                التالي
              </button>
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}

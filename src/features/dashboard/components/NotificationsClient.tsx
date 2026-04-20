"use client";

import type { ReactElement } from "react";
import { useMemo } from "react";

import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { NotificationsList } from "@/features/dashboard/components/NotificationsList";
import { useNotifications } from "@/features/dashboard/hooks";

export function NotificationsClient(): ReactElement {
  const notificationsQuery = useNotifications();

  const unreadNotificationsCount = useMemo(() => {
    const list = notificationsQuery.data ?? [];
    return list.filter((item) => !item.isRead).length;
  }, [notificationsQuery.data]);

  return (
    <>
      <DashboardHeader unreadNotificationsCount={unreadNotificationsCount} />

      <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <section className="grid grid-cols-12 gap-8">
          <div className="col-span-12 rounded-2xl border border-border-soft bg-surface p-6 shadow-[0_6px_18px_rgba(33,37,41,0.08)]">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">الإشعارات</h1>
            <p className="mt-3 text-base leading-8 text-text-secondary">
              راجع التحديثات الجديدة وعلّم الإشعارات كمقروءة عند الانتهاء.
            </p>
          </div>

          {notificationsQuery.isError ? (
            <div className="col-span-12 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-[0_8px_20px_rgba(220,38,38,0.08)]">
              تعذر جلب الإشعارات من الخادم. حاول مرة أخرى.
            </div>
          ) : null}

          <div className="col-span-12">
            {notificationsQuery.isPending ? (
              <div className="rounded-2xl border border-border-soft bg-surface p-8 text-center text-sm text-text-secondary shadow-[0_6px_18px_rgba(33,37,41,0.08)]">
                جارٍ تحميل الإشعارات...
              </div>
            ) : (
              <NotificationsList notifications={notificationsQuery.data ?? []} />
            )}
          </div>
        </section>
      </main>
    </>
  );
}

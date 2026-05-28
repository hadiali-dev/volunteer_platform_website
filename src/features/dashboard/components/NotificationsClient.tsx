"use client";

import type { ReactElement } from "react";
import { useMemo } from "react";

import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { NotificationsList } from "@/features/dashboard/components/NotificationsList";
import { useNotifications, useMarkNotificationAsRead } from "@/features/dashboard/hooks";

export function NotificationsClient(): ReactElement {
  const notificationsQuery = useNotifications();

  const unreadNotificationsCount = useMemo(() => {
    const list = notificationsQuery.data ?? [];
    return list.filter((item) => !item.isRead).length;
  }, [notificationsQuery.data]);

  const markAsReadMutation = useMarkNotificationAsRead();

  const handleMarkAll = async () => {
    const list = notificationsQuery.data ?? [];
    const unreadIds = list.filter((n) => !n.isRead).map((n) => n._id);
    if (unreadIds.length === 0) return;

    try {
      await Promise.all(unreadIds.map((id) => markAsReadMutation.mutateAsync(id)));
    } catch (e) {
      // best-effort: server errors will be surfaced by hooks/notifications query
    }
  };

  return (
    <>
      <DashboardHeader unreadNotificationsCount={unreadNotificationsCount} />

      <main dir="rtl" className="mx-auto w-full max-w-4xl px-6 py-8">
        <header className="mb-6 grid grid-cols-3 items-center gap-4">
          <div className="text-left">
            <button
              type="button"
              onClick={handleMarkAll}
              disabled={markAsReadMutation.isPending}
              className="text-sm text-emerald-600 hover:underline disabled:opacity-60"
            >
              تحديد الكل كمقروء
            </button>
          </div>

          <div className="col-span-2 text-right sm:text-center">
            <h1 className="text-3xl font-bold text-gray-800">الإشعارات</h1>
            <p className="mt-1 text-sm text-gray-500">
              راجع التحديثات الجديدة وعلّم الإشعارات كمقروءة عند الانتهاء.
            </p>
          </div>
        </header>

        <section>
          {notificationsQuery.isError ? (
            <div className="rounded-2xl p-6 text-sm text-red-700 shadow-sm bg-red-50">
              تعذر جلب الإشعارات من الخادم. حاول مرة أخرى.
            </div>
          ) : null}

          {notificationsQuery.isPending ? (
            <div className="rounded-2xl p-8 text-center text-sm text-text-secondary shadow-sm bg-surface">
              جارٍ تحميل الإشعارات...
            </div>
          ) : (
            <NotificationsList notifications={notificationsQuery.data ?? []} />
          )}
        </section>
      </main>
    </>
  );
}

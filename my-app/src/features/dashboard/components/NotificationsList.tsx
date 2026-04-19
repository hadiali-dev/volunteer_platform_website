"use client";

import type { ReactElement } from "react";

import { useMarkNotificationAsRead } from "@/features/dashboard/hooks";
import type { Notification } from "@/features/dashboard/schemas";
import { formatDate } from "@/lib/utils";

interface NotificationsListProps {
  notifications: Notification[];
}

const notificationTypeMeta: Record<
  Notification["type"],
  { label: string; className: string }
> = {
  general: {
    label: "إشعار",
    className: "border-slate-200 bg-slate-100 text-slate-700",
  },
  application_accepted: {
    label: "تم قبول الطلب",
    className: "border-emerald-200 bg-emerald-100 text-emerald-800",
  },
  application_rejected: {
    label: "تم رفض الطلب",
    className: "border-red-200 bg-red-100 text-red-700",
  },
};

export function NotificationsList({
  notifications,
}: NotificationsListProps): ReactElement {
  const markAsReadMutation = useMarkNotificationAsRead();

  if (notifications.length === 0) {
    return (
      <div className="rounded-2xl border border-border-soft bg-surface p-8 text-center shadow-[0_6px_18px_rgba(33,37,41,0.08)]">
        <h3 className="text-2xl font-semibold text-foreground">لا توجد إشعارات حالياً</h3>
        <p className="mt-2 text-base leading-8 text-text-secondary">
          عندما يصلك أي تحديث جديد سيظهر هنا.
        </p>
      </div>
    );
  }

  return (
    <section className="grid gap-4">
      {notifications.map((notification) => (
        <article
          key={notification._id}
          className="rounded-2xl border border-border-soft bg-surface p-6 shadow-[0_6px_18px_rgba(33,37,41,0.08)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="grid gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold ${
                    notificationTypeMeta[notification.type].className
                  }`}
                >
                  {notificationTypeMeta[notification.type].label}
                </span>
                {!notification.isRead ? (
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                ) : null}
              </div>

              <p className="text-base leading-8 text-foreground">{notification.message}</p>
              <p className="text-sm text-text-secondary">
                تاريخ الإشعار: {formatDate(notification.createdAt)}
              </p>
            </div>

            {notification.isRead ? (
              <span className="inline-flex h-9 items-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-700">
                تمت القراءة
              </span>
            ) : (
              <button
                type="button"
                onClick={() => markAsReadMutation.mutate(notification._id)}
                disabled={markAsReadMutation.isPending}
                className="inline-flex h-9 items-center rounded-lg bg-accent px-3 text-xs font-bold text-white transition hover:bg-accent-strong disabled:opacity-70"
              >
                تعليم كمقروء
              </button>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}

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
      <div className="rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-semibold text-gray-800">لا توجد إشعارات حالياً</h3>
        <p className="mt-2 text-base text-gray-500">عندما يصلك أي تحديث جديد سيظهر هنا.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {notifications.map((notification, idx) => (
        <div
          key={notification._id}
          className={`group flex items-start gap-4 px-4 py-4 ${!notification.isRead ? "bg-emerald-50" : ""} ${
            idx !== notifications.length - 1 ? "border-b border-gray-100" : ""
          } flex-row-reverse`}
        >
          {/* Right: Icon */}
          <div className="flex-shrink-0">
            <span
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                notification.type === "application_accepted"
                  ? "bg-emerald-100 text-emerald-700"
                  : notification.type === "application_rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {notification.type === "application_accepted" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.071 7.07a1 1 0 01-1.414 0l-3.182-3.181a1 1 0 011.414-1.415l2.475 2.474 6.364-6.364a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : notification.type === "application_rejected" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2.293-9.293a1 1 0 011.414 0L10 8.586l1.879-1.879a1 1 0 111.414 1.414L11.414 10l1.879 1.879a1 1 0 11-1.414 1.414L10 11.414l-1.879 1.879a1 1 0 11-1.414-1.414L8.586 10 6.707 8.121a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                  <path d="M9 18a2 2 0 104 0H9z" />
                </svg>
              )}
            </span>
          </div>

          {/* Middle: Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold text-gray-800 truncate">
                {notificationTypeMeta[notification.type].label}
              </p>
              {!notification.isRead ? <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" /> : null}
            </div>

            <p className="mt-1 text-sm text-gray-500 truncate">{notification.message}</p>
            <p className="mt-2 text-xs text-gray-400">{formatDate(notification.createdAt)}</p>
          </div>

          {/* Left: Actions */}
          <div className="flex items-start">
            {notification.isRead ? (
              <span className="text-sm text-gray-400 opacity-60">مقروء</span>
            ) : (
              <button
                type="button"
                onClick={() => markAsReadMutation.mutate(notification._id)}
                disabled={markAsReadMutation.isPending}
                className="text-sm text-emerald-600 opacity-0 group-hover:opacity-100 transition"
              >
                تمت القراءة
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

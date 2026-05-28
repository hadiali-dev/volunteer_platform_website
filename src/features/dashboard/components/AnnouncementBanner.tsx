import type { ReactElement } from "react";

import type { Announcement } from "@/features/dashboard/schemas";

interface AnnouncementBannerProps {
  announcement: Announcement | null;
  isLoading: boolean;
}

export function AnnouncementBanner({
  announcement,
  isLoading,
}: AnnouncementBannerProps): ReactElement {
  if (isLoading) {
    return (
      <section className="w-full rounded-2xl border border-emerald-200 bg-emerald-50/35 p-6 sm:p-8">
        <p className="text-sm text-emerald-700">جارٍ تحميل لوحة الإعلانات...</p>
      </section>
    );
  }

  if (!announcement) {
    return (
      <section className="w-full rounded-2xl border border-emerald-200 bg-emerald-50/35 p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-emerald-900">لوحة الإعلانات</h3>
        <p className="mt-1 text-sm leading-relaxed text-emerald-700">
          لا يوجد إعلان نشط حاليًا. ترقب المزيد من الأحداث والفرص قريبًا.
        </p>
      </section>
    );
  }

  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl border border-emerald-300/40 p-6 sm:p-8 lg:p-10"
    >
      <div
        className="absolute inset-0 bg-center bg-no-repeat [background-size:contain] sm:[background-size:cover]"
        style={{
          backgroundImage: `url(${announcement.backgroundImage})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-emerald-800/65 to-emerald-500/70" />
      <div className="relative flex min-h-48 flex-col justify-center gap-3 sm:min-h-40">
        <span className="w-fit rounded-full bg-emerald-50/90 px-3 py-1 text-xs font-semibold text-emerald-800">
          إعلان مميز
        </span>
        <h3 className="text-xl font-semibold leading-snug text-emerald-50 sm:text-2xl">{announcement.title}</h3>
        <p className="max-w-5xl text-sm leading-relaxed text-emerald-100 sm:text-base">{announcement.description}</p>
        {announcement.ctaUrl ? (
          <a
            href={announcement.ctaUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex w-fit items-center justify-center rounded-lg border border-emerald-100/70 bg-emerald-50/95 px-4 py-2 text-sm font-bold text-emerald-900 transition hover:bg-white"
          >
            {announcement.ctaLabel ?? "اعرف التفاصيل"}
          </a>
        ) : null}
      </div>
    </section>
  );
}


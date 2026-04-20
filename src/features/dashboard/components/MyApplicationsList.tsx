import Image from "next/image";
import type { ReactElement } from "react";

import type { Application, ApplicationStatus } from "@/features/dashboard/schemas";
import { formatDate } from "@/lib/utils";

interface MyApplicationsListProps {
  applications: Application[];
}

const statusLabel: Record<ApplicationStatus, string> = {
  pending: "قيد المراجعة",
  accepted: "مقبول",
  rejected: "مرفوض",
};

const statusClassName: Record<ApplicationStatus, string> = {
  pending: "bg-emerald-100 text-emerald-800",
  accepted: "bg-emerald-100 text-emerald-800",
  rejected: "bg-emerald-100 text-emerald-800",
};

const PLACEHOLDER_IMAGES = [
  "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/6995030/pexels-photo-6995030.jpeg?auto=compress&cs=tinysrgb&w=2000",
];
const FALLBACK_IMAGE = PLACEHOLDER_IMAGES[0] ?? "";

const getPlaceholderImage = (seed: string): string => {
  const normalizedSeed = seed.trim();
  const hash = Array.from(normalizedSeed).reduce((accumulator, char) => {
    return accumulator + char.charCodeAt(0);
  }, 0);

  return PLACEHOLDER_IMAGES[hash % PLACEHOLDER_IMAGES.length] ?? FALLBACK_IMAGE;
};

const resolveImageSrc = (
  image: string | null | undefined,
  placeholderSeed: string,
): string => {
  if (typeof image !== "string") {
    return getPlaceholderImage(placeholderSeed);
  }

  const trimmedImage = image.trim();
  return trimmedImage.length > 0 ? trimmedImage : getPlaceholderImage(placeholderSeed);
};

export function MyApplicationsList({
  applications,
}: MyApplicationsListProps): ReactElement {
  if (applications.length === 0) {
    return (
      <section className="rounded-2xl border border-border-soft bg-surface p-8 text-center shadow-[0_6px_18px_rgba(33,37,41,0.08)]">
        <h3 className="text-2xl font-semibold text-foreground">لا توجد طلبات بهذا الفلتر</h3>
        <p className="mt-2 text-base leading-8 text-text-secondary">
          يمكنك تغيير الحالة أو الانتقال لصفحة الفرص للتقديم على فرص جديدة.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {applications.map((application) => (
        <article
          key={application._id}
          className="overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-[0_6px_18px_rgba(33,37,41,0.08)]"
        >
          <div className="flex min-h-44 flex-col md:flex-row">
            <div className="relative h-44 md:h-auto md:w-44">
              <Image
                src={resolveImageSrc(application.opportunity.image, application.opportunity._id)}
                alt={`صورة فرصة ${application.opportunity.title}`}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <div className="grid flex-1 gap-3 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClassName[application.status]}`}
                >
                  {statusLabel[application.status]}
                </span>
                <p className="text-xs text-text-secondary">
                  تاريخ التقديم: {formatDate(application.appliedAt)}
                </p>
              </div>

              <h3 className="line-clamp-2 text-xl font-semibold leading-tight text-foreground">
                {application.opportunity.title}
              </h3>

              <p className="line-clamp-2 text-sm leading-7 text-text-secondary">
                {application.opportunity.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-1 text-xs text-emerald-800">
                <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1">
                  الموقع: {application.opportunity.location}
                </span>
                <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1">
                  تاريخ الفرصة: {formatDate(application.opportunity.date)}
                </span>
                <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1">
                  الجهة: {application.opportunity.organization?.name ?? "جهة تطوعية"}
                </span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}


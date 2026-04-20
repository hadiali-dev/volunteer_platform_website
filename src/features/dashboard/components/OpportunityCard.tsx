import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";

import type { Opportunity, OpportunityCategory } from "@/features/dashboard/schemas";
import { formatDate } from "@/lib/utils";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const CATEGORY_LABELS: Record<OpportunityCategory, string> = {
  educational: "تعليمي",
  health: "صحي",
  environmental: "بيئي",
  social: "اجتماعي",
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

export function OpportunityCard({ opportunity }: OpportunityCardProps): ReactElement {
  return (
    <article className="group overflow-hidden rounded-xl border border-border-soft bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <div className="relative h-44 overflow-hidden">
        <Image
          src={resolveImageSrc(opportunity.image, opportunity._id)}
          alt={`صورة لفرصة ${opportunity.title}`}
          fill
          unoptimized
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
            {CATEGORY_LABELS[opportunity.category]}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-1">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M8 7V17M8 7C8 5.89543 8.89543 5 10 5H16C17.1046 5 18 5.89543 18 7V17C18 18.1046 17.1046 19 16 19H10C8.89543 19 8 18.1046 8 17M8 7V4M12 12H16M12 8H16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {formatDate(opportunity.date)}
          </span>
        </div>

        <h3 className="line-clamp-2 text-xl font-semibold leading-snug text-foreground">
          {opportunity.title}
        </h3>

        <p className="line-clamp-3 text-sm leading-relaxed text-text-secondary">
          {opportunity.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-sm text-emerald-800">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M12 21C12 21 18 15.6 18 10.2C18 6.776 15.3137 4 12 4C8.68629 4 6 6.776 6 10.2C6 15.6 12 21 12 21Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            {opportunity.location}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M17 20H7M17 20V16H7V20M17 20H20V14C20 12.8954 19.1046 12 18 12H15M7 20H4V14C4 12.8954 4.89543 12 6 12H9M12 12V9M12 9C13.6569 9 15 7.65685 15 6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6C9 7.65685 10.3431 9 12 9Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {opportunity.maxVolunteers} متطوع
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M12 20.5C11.7 20.5 11.4 20.4 11.2 20.2L5.7 15.2C3.2 12.9 2.9 9 5 6.9C7.1 4.8 10.4 5 12 7.2C13.6 5 16.9 4.8 19 6.9C21.1 9 20.8 12.9 18.3 15.2L12.8 20.2C12.6 20.4 12.3 20.5 12 20.5Z"
                fill="currentColor"
              />
            </svg>
            {opportunity.likes.length}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M8 10H16M8 14H12M20 12C20 16.4183 16.4183 20 12 20C10.5 20 9.1 19.6 7.9 18.9L4 20L5.1 16.1C4.4 14.9 4 13.5 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {opportunity.comments.length}
          </span>
        </div>

        <Link
          href={`/dashboard/opportunities/${opportunity._id}`}
          prefetch
          className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-strong"
        >
          تفاصيل الفرصة
        </Link>
      </div>
    </article>
  );
}


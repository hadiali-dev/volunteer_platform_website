"use client";

import type { ReactElement } from "react";

export function AdBanner(): ReactElement {
  return (
    <section className="rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 text-white p-6 sm:p-8 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/12">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 2C12 2 17 5 17 10C17 14 14 17 12 19C10 17 7 14 7 10C7 5 12 2 12 2Z" fill="currentColor" />
              <path d="M12 2V22" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5" />
            </svg>
          </div>

          <div>
            <h3 className="text-lg font-semibold">ادعم الطاقة الخضراء</h3>
            <p className="mt-1 text-sm opacity-90">انضم لمبادراتنا لدعم الطاقة المتجددة وحماية البيئة المحلية.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#"
            className="inline-flex items-center rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-emerald-700 hover:brightness-95"
          >
            اعرف المزيد
          </a>
        </div>
      </div>
    </section>
  );
}

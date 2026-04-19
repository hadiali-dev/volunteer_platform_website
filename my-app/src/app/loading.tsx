import type { ReactElement } from "react";

export default function Loading(): ReactElement {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,rgba(22,155,98,0.12),transparent_42%),linear-gradient(180deg,#f8fff8_0%,#ffffff_45%,#f4fff7_100%)] px-6">
      <section className="w-full max-w-md rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 text-center shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-semibold text-emerald-700">جاري تحميل الصفحة...</p>
      </section>
    </main>
  );
}

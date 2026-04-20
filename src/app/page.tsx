import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";

import { auth } from "@/lib/auth";

export default async function HomePage(): Promise<ReactElement> {
  const session = await auth();

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-14 sm:px-8">
      <Image
        src="https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1920"
        alt="متطوعون يعملون معًا في نشاط مجتمعي"
        fill
        priority
        unoptimized
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(6,30,19,0.55),rgba(10,63,39,0.42))]" />

      <section className="relative mx-auto grid w-full max-w-5xl gap-6 rounded-3xl border border-white/35 bg-white/88 p-8 shadow-[0_30px_90px_rgba(8,65,38,0.22)] backdrop-blur sm:p-12">
        <p className="w-fit rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent-strong">
          منصة فولنتير
        </p>

        <h1 className="text-3xl font-bold leading-[1.7] text-foreground sm:text-4xl">
          {session?.user?.name
            ? `أهلًا بك ${session.user.name} في مجتمع التطوع.`
            : "مرحبًا بك في فولنتير"}
        </h1>

        <p className="max-w-3xl text-sm leading-8 text-emerald-900/75 sm:text-base">
          منصة عربية تجمع المتطوعين والجهات المنظمة في تجربة واضحة وسريعة للوصول
          إلى فرص التطوع والمشاركة في صنع أثر حقيقي.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/login"
            prefetch
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border-soft bg-white px-4 text-sm font-semibold text-foreground transition hover:bg-emerald-50"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            prefetch
            className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-white transition hover:bg-accent-strong"
          >
            إنشاء حساب
          </Link>
        </div>
      </section>
    </main>
  );
}

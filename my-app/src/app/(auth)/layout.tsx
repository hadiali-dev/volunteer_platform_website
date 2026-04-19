import type { Metadata } from "next";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: "المصادقة | فولنتير",
  description: "صفحات تسجيل الدخول وإنشاء الحساب في منصة فولنتير.",
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): ReactElement {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(22,155,98,0.15),transparent_36%),linear-gradient(180deg,#f8fff8_0%,#ffffff_45%,#f4fff7_100%)]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-8">
        <div className="grid w-full gap-7 rounded-3xl border border-border-soft bg-white/80 p-6 shadow-[0_25px_80px_rgba(10,60,35,0.08)] backdrop-blur sm:p-10 lg:grid-cols-2">
          <div className="order-2 flex flex-col justify-center gap-4 lg:order-1">
            <p className="w-fit rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent-strong">
              منصة تطوع عربية
            </p>
            <h1 className="text-3xl font-bold leading-[1.6] text-foreground sm:text-4xl">
              مكان واحد لإدارة حسابك والتطوع بثقة
            </h1>
            <p className="text-sm leading-8 text-emerald-900/75 sm:text-base">
              سجل الدخول أو أنشئ حسابًا جديدًا للوصول إلى فرص التطوع، متابعة الطلبات،
              والتواصل مع الجهات المنظمة.
            </p>

            <div className="mt-2 flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <svg
                  viewBox="0 0 64 64"
                  className="h-9 w-9 text-accent"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M31 52V34"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M31 36C31 24 39 16 52 14C50 27 42 35 31 36Z"
                    fill="currentColor"
                    fillOpacity="0.25"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M31 31C31 20 24 13 12 11C13 23 20 30 31 31Z"
                    fill="currentColor"
                    fillOpacity="0.18"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 52H40"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-900">
                  أثرك يبدأ بخطوة صغيرة
                </p>
                <p className="text-xs leading-6 text-emerald-900/70">
                  مع كل مساهمة تطوعية نزرع أثرًا أجمل في المجتمع.
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 rounded-2xl border border-border-soft bg-white p-5 shadow-sm sm:p-7 lg:order-2">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}

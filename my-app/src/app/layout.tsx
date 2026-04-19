import type { Metadata } from "next";
import { Geist_Mono, Tajawal } from "next/font/google";
import Link from "next/link";
import type { ReactElement } from "react";

import { Providers } from "@/lib/providers";

import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "فولنتير",
  description: "منصة تطوع عربية بواجهة سهلة لإدارة الحسابات واستكشاف الفرص التطوعية.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <main className="flex-1">{children}</main>

            <footer className="border-t border-border-soft bg-surface/95">
              <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 sm:px-10 lg:grid-cols-4 lg:px-12">
                <section className="grid gap-3">
                  <h2 className="text-lg font-bold text-foreground">فولنتير</h2>
                  <p className="text-sm leading-7 text-text-secondary">
                    منصة عربية لربط المتطوعين بالفرص المناسبة وبناء أثر مجتمعي مستدام.
                  </p>
                </section>

                <section className="grid gap-2 text-sm">
                  <h3 className="font-semibold text-foreground">روابط سريعة</h3>
                  <Link href="/dashboard" className="text-text-secondary transition hover:text-accent">
                    الفرص
                  </Link>
                  <Link
                    href="/my-applications"
                    className="text-text-secondary transition hover:text-accent"
                  >
                    طلباتي
                  </Link>
                  <Link href="/profile" className="text-text-secondary transition hover:text-accent">
                    الملف الشخصي
                  </Link>
                  <Link
                    href="/notifications"
                    className="text-text-secondary transition hover:text-accent"
                  >
                    الإشعارات
                  </Link>
                </section>

                <section className="grid gap-2 text-sm">
                  <h3 className="font-semibold text-foreground">معلومات قانونية</h3>
                  <a href="#" className="text-text-secondary transition hover:text-accent">
                    سياسة الخصوصية
                  </a>
                  <a href="#" className="text-text-secondary transition hover:text-accent">
                    شروط الاستخدام
                  </a>
                  <a href="#" className="text-text-secondary transition hover:text-accent">
                    سياسة ملفات الارتباط
                  </a>
                </section>

                <section className="grid gap-2 text-sm">
                  <h3 className="font-semibold text-foreground">تواصل معنا</h3>
                  <a
                    href="mailto:support@volunteer-arabia.com"
                    className="text-text-secondary transition hover:text-accent"
                  >
                    support@volunteer-sy.com
                  </a>
                  <a
                    href="tel:+9639214287"
                    className="text-text-secondary transition hover:text-accent"
                  >
                    +963 921 421 87
                  </a>
                  <p className="text-text-secondary">الجمهورية العرببة السورية-طرطوس</p>
                </section>
              </div>

              <div className="border-t border-border-soft">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-4 text-sm text-text-secondary sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
                  <p>© {currentYear} فولنتير. جميع الحقوق محفوظة.</p>
                  <p>صُمم لخدمة العمل التطوعي العربي.</p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}

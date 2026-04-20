"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  unreadNotificationsCount: number;
}

type ThemeMode = "light" | "dark";

interface NavigationItem {
  href: string;
  label: string;
}

const navigationItems: NavigationItem[] = [
  { href: "/dashboard", label: "الفرص" },
  { href: "/my-applications", label: "طلباتي" },
  { href: "/profile", label: "الملف الشخصي" },
];

export function DashboardHeader({
  unreadNotificationsCount,
}: DashboardHeaderProps): ReactElement {
  const pathname = usePathname();
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const storedTheme = window.localStorage.getItem("volunteer-theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    document.documentElement.style.colorScheme = themeMode;
    window.localStorage.setItem("volunteer-theme", themeMode);
  }, [themeMode]);

  const toggleTheme = (): void => {
    setThemeMode((current) => (current === "light" ? "dark" : "light"));
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border-soft bg-surface px-6 py-4 sm:px-10 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-lg font-bold text-foreground">فولنتير</p>
          <p className="text-sm text-text-secondary">منصة فرص تطوعية عربية</p>
        </div>

        <nav className="flex items-center gap-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={cn(
                  "inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-accent text-white"
                    : "text-foreground hover:bg-accent-soft hover:text-accent",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="تبديل الوضع الليلي والنهاري"
          >
            <span className="theme-icon-spin inline-flex">
              {themeMode === "dark" ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3V5.5M12 18.5V21M5.64 5.64L7.42 7.42M16.58 16.58L18.36 18.36M3 12H5.5M18.5 12H21M5.64 18.36L7.42 16.58M16.58 7.42L18.36 5.64"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="12" r="4" fill="currentColor" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.4 14.1C19.6 14.4 18.8 14.5 18 14.5C14.1 14.5 11 11.4 11 7.5C11 6.3 11.3 5.2 11.8 4.3C8.2 4.9 5.5 8 5.5 11.8C5.5 16 8.9 19.5 13.2 19.5C16.9 19.5 20 16.8 20.4 13.2V14.1Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </span>
          </button>

          <Link
            href="/notifications"
            prefetch
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="فتح صفحة الإشعارات"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 17H9M18 17H21L19 15V10C19 6.68629 16.3137 4 13 4H11C7.68629 4 5 6.68629 5 10V15L3 17H6"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 20C10.4583 20.623 11.1904 21 12 21C12.8096 21 13.5417 20.623 14 20"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
            </svg>
            {unreadNotificationsCount > 0 ? (
              <span className="absolute -left-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold leading-5 text-white">
                {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}

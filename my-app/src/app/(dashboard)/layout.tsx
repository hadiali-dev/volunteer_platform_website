import { redirect } from "next/navigation";
import type { ReactElement } from "react";

import { auth } from "@/lib/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps): Promise<ReactElement> {
  const session = await auth();

  if (!session?.accessToken) {
    redirect("/login");
  }

  return <div className="min-h-screen bg-background transition-colors duration-500">{children}</div>;
}

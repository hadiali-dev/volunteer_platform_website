import { RegisterForm } from "@/features/auth";
import type { ReactElement } from "react";

export default function RegisterPage(): ReactElement {
  return (
    <div className="grid gap-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">إنشاء حساب</h2>
        <p className="text-sm text-emerald-900/75">
          أنشئ حسابك الآن وابدأ رحلتك في العمل التطوعي.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}

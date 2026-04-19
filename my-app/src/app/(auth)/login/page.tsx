import { LoginForm } from "@/features/auth";
import type { ReactElement } from "react";

export default function LoginPage(): ReactElement {
  return (
    <div className="grid gap-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">تسجيل الدخول</h2>
        <p className="text-sm text-emerald-900/75">
          أدخل بياناتك للوصول إلى حسابك.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}

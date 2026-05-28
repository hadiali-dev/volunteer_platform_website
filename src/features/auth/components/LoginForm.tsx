"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

import { LoginInputSchema, type LoginInput } from "@/features/auth/schemas";
import { useLogin } from "@/features/auth/hooks";
import { AppError } from "@/types";

export function LoginForm(): ReactElement {
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const inputBase =
    "h-12 rounded-xl px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

  const onSubmit = async (values: LoginInput): Promise<void> => {
    await loginMutation.mutateAsync(values);
    router.replace("/dashboard");
    router.refresh();
  };

  const globalError =
    loginMutation.error instanceof AppError
      ? loginMutation.error.message
      : loginMutation.error instanceof Error
        ? loginMutation.error.message
        : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-semibold text-foreground">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className={cn(
            inputBase,
            errors.email ? "border-red-600 bg-red-50" : "border-border-soft bg-white",
          )}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <p id="email-error" role="alert" className="text-sm text-red-600">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="password" className="text-sm font-semibold text-foreground">
          كلمة المرور
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="أدخل كلمة المرور"
          className={cn(
            inputBase,
            errors.password ? "border-red-600 bg-red-50" : "border-border-soft bg-white",
          )}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password ? (
          <p id="password-error" role="alert" className="text-sm text-red-600">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {globalError ? (
        <div role="alert" aria-live="assertive">
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{globalError}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || loginMutation.isPending}
        className="h-12 rounded-xl bg-accent text-sm font-bold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting || loginMutation.isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </button>

      <p className="text-sm text-emerald-900/80">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="font-bold text-accent hover:text-accent-strong">
          إنشاء حساب جديد
        </Link>
      </p>
    </form>
  );
}

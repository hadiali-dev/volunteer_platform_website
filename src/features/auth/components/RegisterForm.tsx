"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

import { useSignup } from "@/features/auth/hooks";
import { SignupInputSchema, type SignupInput } from "@/features/auth/schemas";
import { AppError } from "@/types";

export function RegisterForm(): ReactElement {
  const router = useRouter();
  const signupMutation = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(SignupInputSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
    },
  });

  const inputBase =
    "h-12 rounded-xl px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

  const onSubmit = async (values: SignupInput): Promise<void> => {
    await signupMutation.mutateAsync(values);
    if (values.role === "student" || values.role === undefined) {
      router.replace("/profile/setup");
      router.refresh();
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  };

  const globalError =
    signupMutation.error instanceof AppError
      ? signupMutation.error.message
      : signupMutation.error instanceof Error
        ? signupMutation.error.message
        : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-semibold text-foreground">
          الاسم الكامل
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="أدخل اسمك الكامل"
          className={cn(inputBase, errors.name ? "border-red-600 bg-red-50" : "border-border-soft bg-white")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
        {errors.name ? (
          <p id="name-error" role="alert" className="text-sm text-red-600">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-semibold text-foreground">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className={cn(inputBase, errors.email ? "border-red-600 bg-red-50" : "border-border-soft bg-white")}
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
          autoComplete="new-password"
          placeholder="6 أحرف على الأقل"
          className={cn(inputBase, errors.password ? "border-red-600 bg-red-50" : "border-border-soft bg-white")}
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

      <div className="grid gap-2">
        <label htmlFor="role" className="text-sm font-semibold text-foreground">
          نوع الحساب
        </label>
        <select
          id="role"
          className={cn(inputBase, "border-border-soft bg-white")}
          {...register("role")}
        >
          <option value="student">متطوع</option>
          <option value="organization">جهة منظمة</option>
        </select>
      </div>

      {globalError ? (
        <div role="alert" aria-live="assertive">
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{globalError}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || signupMutation.isPending}
        className="h-12 rounded-xl bg-accent text-sm font-bold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting || signupMutation.isPending ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
      </button>

      <p className="text-sm text-emerald-900/80">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="font-bold text-accent hover:text-accent-strong">
          تسجيل الدخول
        </Link>
      </p>
    </form>
  );
}

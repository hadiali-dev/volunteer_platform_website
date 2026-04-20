"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactElement } from "react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import {
  useNotifications,
  useUpdateMyProfile,
} from "@/features/dashboard/hooks";
import {
  VolunteerProfileFormSchema,
  type UpdateVolunteerProfileInput,
  type VolunteerProfileFormInput,
} from "@/features/dashboard/schemas";
import { AppError } from "@/types";

const parseList = (value: string): string[] => {
  return value
    .split(/[,،]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const toUpdatePayload = (
  values: VolunteerProfileFormInput,
): UpdateVolunteerProfileInput => {
  const payload: UpdateVolunteerProfileInput = {
    bio: values.bio?.trim() ?? "",
    skills: parseList(values.skillsText ?? ""),
    interests: parseList(values.interestsText ?? ""),
  };

  const imageValue = values.image?.trim();
  if (imageValue) {
    payload.image = imageValue;
  }

  return payload;
};

export function ProfileSetupClient(): ReactElement {
  const router = useRouter();
  const notificationsQuery = useNotifications();
  const updateProfileMutation = useUpdateMyProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerProfileFormInput>({
    resolver: zodResolver(VolunteerProfileFormSchema),
    defaultValues: {
      image: "",
      bio: "",
      skillsText: "",
      interestsText: "",
    },
  });

  const unreadNotificationsCount = useMemo(() => {
    const list = notificationsQuery.data ?? [];
    return list.filter((item) => !item.isRead).length;
  }, [notificationsQuery.data]);

  const globalError =
    updateProfileMutation.error instanceof AppError
      ? updateProfileMutation.error.message
      : updateProfileMutation.error instanceof Error
        ? updateProfileMutation.error.message
        : null;

  const onSubmit = async (values: VolunteerProfileFormInput): Promise<void> => {
    await updateProfileMutation.mutateAsync(toUpdatePayload(values));
    router.replace("/dashboard");
    router.refresh();
  };

  return (
    <>
      <DashboardHeader unreadNotificationsCount={unreadNotificationsCount} />

      <main className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-10 lg:px-12">
        <section className="overflow-hidden rounded-3xl border border-border-soft bg-gradient-to-b from-accent-soft via-surface to-surface-strong shadow-[0_14px_36px_rgba(17,94,89,0.12)]">
          <div className="border-b border-border-soft bg-surface/80 px-6 py-5 sm:px-8">
            <p className="text-sm font-semibold text-emerald-700">الخطوة التالية بعد التسجيل</p>
            <h1 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">
              أكمل ملفك الشخصي
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-8 text-text-secondary">
              أضف نبذة قصيرة ومهاراتك واهتماماتك لنرشّح لك فرصًا تطوعية مناسبة بشكل أدق.
            </p>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
              <div className="grid gap-2">
                <label htmlFor="image" className="text-sm font-semibold text-foreground">
                  رابط الصورة الشخصية (اختياري)
                </label>
                <input
                  id="image"
                  placeholder="https://..."
                  className="h-11 rounded-xl border border-border-soft bg-surface px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  {...register("image")}
                />
                {errors.image ? <p className="text-sm text-red-600">{errors.image.message}</p> : null}
              </div>

              <div className="grid gap-2">
                <label htmlFor="bio" className="text-sm font-semibold text-foreground">
                  نبذة عنك
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  placeholder="مثال: أحب العمل التطوعي في المجالات التعليمية والصحية..."
                  className="rounded-xl border border-border-soft bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  {...register("bio")}
                />
                {errors.bio ? <p className="text-sm text-red-600">{errors.bio.message}</p> : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <label htmlFor="skillsText" className="text-sm font-semibold text-foreground">
                    المهارات (مفصولة بفاصلة)
                  </label>
                  <input
                    id="skillsText"
                    placeholder="تنظيم، تواصل، قيادة"
                    className="h-11 rounded-xl border border-border-soft bg-surface px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    {...register("skillsText")}
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="interestsText" className="text-sm font-semibold text-foreground">
                    الاهتمامات (مفصولة بفاصلة)
                  </label>
                  <input
                    id="interestsText"
                    placeholder="تعليم، بيئة، صحة"
                    className="h-11 rounded-xl border border-border-soft bg-surface px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    {...register("interestsText")}
                  />
                </div>
              </div>

              {globalError ? (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{globalError}</p>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                >
                  تخطٍ الآن وإكماله لاحقًا
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting || updateProfileMutation.isPending}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#28a773,#1f875d)] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(40,167,115,0.28)] transition hover:brightness-105 disabled:opacity-70"
                >
                  {isSubmitting || updateProfileMutation.isPending
                    ? "جارٍ حفظ البيانات..."
                    : "حفظ المتابعة"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

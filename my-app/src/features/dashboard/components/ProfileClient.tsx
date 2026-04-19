"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import {
  useMyProfile,
  useNotifications,
  useUpdateMyProfile,
} from "@/features/dashboard/hooks";
import {
  VolunteerProfileFormSchema,
  type UpdateVolunteerProfileInput,
  type VolunteerProfileFormInput,
} from "@/features/dashboard/schemas";
import { AppError } from "@/types";
import { formatDate } from "@/lib/utils";

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

export function ProfileClient(): ReactElement {
  const notificationsQuery = useNotifications();
  const profileQuery = useMyProfile();
  const updateProfileMutation = useUpdateMyProfile();
  const [failedAvatarSrc, setFailedAvatarSrc] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
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

  useEffect(() => {
    const profile = profileQuery.data;
    if (!profile) {
      return;
    }

    reset({
      image: profile.image ?? "",
      bio: profile.bio ?? "",
      skillsText: profile.skills.join(", "),
      interestsText: profile.interests.join(", "),
    });
  }, [profileQuery.data, reset]);

  const unreadNotificationsCount = useMemo(() => {
    const list = notificationsQuery.data ?? [];
    return list.filter((item) => !item.isRead).length;
  }, [notificationsQuery.data]);

  const profileImageSrc = useMemo(() => {
    if (!profileQuery.data) {
      return null;
    }

    const profileImage = profileQuery.data.image?.trim();
    if (profileImage) {
      return profileImage;
    }

    const userImage = profileQuery.data.user.image?.trim();
    return userImage && userImage.length > 0 ? userImage : null;
  }, [profileQuery.data]);

  const profileName = profileQuery.data?.user.name.trim() ?? "";
  const profileInitial = profileName.length > 0 ? profileName.slice(0, 1) : "؟";

  const isAvatarFailed = profileImageSrc !== null && failedAvatarSrc === profileImageSrc;

  const globalError =
    updateProfileMutation.error instanceof AppError
      ? updateProfileMutation.error.message
      : updateProfileMutation.error instanceof Error
        ? updateProfileMutation.error.message
        : null;

  const onSubmit = async (values: VolunteerProfileFormInput): Promise<void> => {
    await updateProfileMutation.mutateAsync(toUpdatePayload(values));
  };

  return (
    <>
      <DashboardHeader unreadNotificationsCount={unreadNotificationsCount} />

      <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <section className="grid grid-cols-12 gap-8">
          <div className="col-span-12 grid gap-3">
            <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              الملف الشخصي
            </h1>
            <p className="text-base leading-8 text-text-secondary">
              عدّل بياناتك، مهاراتك واهتماماتك ليتم ترشيح فرص تطوعية مناسبة لك.
            </p>
          </div>

          {profileQuery.isError ? (
            <div className="col-span-12 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-[0_8px_20px_rgba(220,38,38,0.08)]">
              تعذر جلب بيانات الملف الشخصي من الخادم.
            </div>
          ) : null}

          {profileQuery.isPending ? (
            <div className="col-span-12 rounded-2xl border border-border-soft bg-surface p-8 text-center text-sm text-text-secondary shadow-[0_6px_18px_rgba(33,37,41,0.08)]">
              جارٍ تحميل الملف الشخصي...
            </div>
          ) : null}

          {profileQuery.data ? (
            <>
              <section className="col-span-12 rounded-2xl border border-border-soft bg-surface p-6 shadow-[0_6px_18px_rgba(33,37,41,0.08)] lg:col-span-4">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <div className="mt-1 inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-accent-soft text-lg font-bold text-emerald-800">
                      {profileImageSrc && !isAvatarFailed ? (
                        // Allow user-provided avatar URLs without Next.js domain allowlist constraints.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profileImageSrc}
                          alt={`الصورة الشخصية لـ ${profileQuery.data.user.name}`}
                          className="h-full w-full object-cover"
                          onError={() => setFailedAvatarSrc(profileImageSrc)}
                        />
                      ) : (
                        profileInitial
                      )}
                    </div>
                    <div className="grid gap-0.5">
                      <p className="text-lg font-semibold text-foreground">
                        {profileQuery.data.user.name}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {profileQuery.data.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm">
                    <p className="text-text-secondary">
                      تاريخ الانضمام:{" "}
                      <span className="font-semibold text-foreground">
                        {formatDate(profileQuery.data.joinedAt)}
                      </span>
                    </p>
                    <p className="text-text-secondary">
                      ساعات التطوع:{" "}
                      <span className="font-semibold text-foreground">
                        {profileQuery.data.totalHours}
                      </span>
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
                      <p className="mt-1 text-lg font-bold text-emerald-800">
                        {profileQuery.data.completedOpportunities}
                      </p>
                      <p className="text-xs text-text-secondary">مقبول</p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
                      <p className="mt-1 text-lg font-bold text-emerald-800">
                        {profileQuery.data.pendingApplications}
                      </p>
                      <p className="text-xs text-text-secondary">قيد المراجعة</p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
                      <p className="mt-1 text-lg font-bold text-emerald-800">
                        {profileQuery.data.cancelledApplications}
                      </p>
                      <p className="text-xs text-text-secondary">مرفوض</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="col-span-12 rounded-2xl border border-border-soft bg-surface p-6 shadow-[0_6px_18px_rgba(33,37,41,0.08)] lg:col-span-8">
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="image" className="text-sm font-semibold text-foreground">
                      رابط الصورة الشخصية
                    </label>
                    <input
                      id="image"
                      placeholder="https://..."
                      className="h-11 rounded-xl border border-border-soft bg-surface px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                      {...register("image")}
                    />
                    {errors.image ? (
                      <p className="text-sm text-red-600">{errors.image.message}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="bio" className="text-sm font-semibold text-foreground">
                      نبذة عنك
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      className="rounded-xl border border-border-soft bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                      {...register("bio")}
                    />
                    {errors.bio ? (
                      <p className="text-sm text-red-600">{errors.bio.message}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <label htmlFor="skillsText" className="text-sm font-semibold text-foreground">
                        المهارات (مفصولة بفاصلة)
                      </label>
                      <input
                        id="skillsText"
                        placeholder="إدارة فريق، تنظيم، تواصل"
                        className="h-11 rounded-xl border border-border-soft bg-surface px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                        {...register("skillsText")}
                      />
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor="interestsText"
                        className="text-sm font-semibold text-foreground"
                      >
                        الاهتمامات (مفصولة بفاصلة)
                      </label>
                      <input
                        id="interestsText"
                        placeholder="تعليم، صحة، بيئة"
                        className="h-11 rounded-xl border border-border-soft bg-surface px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                        {...register("interestsText")}
                      />
                    </div>
                  </div>

                  {globalError ? (
                    <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                      {globalError}
                    </p>
                  ) : null}

                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || updateProfileMutation.isPending}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#28a773,#1f875d)] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(40,167,115,0.28)] transition hover:brightness-105 disabled:opacity-70"
                    >
                      {isSubmitting || updateProfileMutation.isPending
                        ? "جارٍ الحفظ..."
                        : "حفظ التعديلات"}
                    </button>
                  </div>
                </form>
              </section>
            </>
          ) : null}
        </section>
      </main>
    </>
  );
}


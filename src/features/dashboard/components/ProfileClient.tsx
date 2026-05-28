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
        <header className="mb-6">
          <h1 className="text-4xl font-extrabold leading-tight text-foreground">الملف الشخصي</h1>
          <p className="mt-2 text-gray-500">عدّل بياناتك، مهاراتك واهتماماتك ليتم ترشيح فرص تطوعية مناسبة لك.</p>
        </header>

        {profileQuery.isError ? (
          <div className="rounded-2xl p-6 text-sm text-red-700 shadow-sm bg-red-50">
            تعذر جلب بيانات الملف الشخصي من الخادم.
          </div>
        ) : null}

        {profileQuery.isPending ? (
          <div className="rounded-2xl p-8 text-center text-sm text-text-secondary shadow-sm bg-surface">
            جارٍ تحميل الملف الشخصي...
          </div>
        ) : null}

        {profileQuery.data ? (
          <div className="flex flex-col gap-8 lg:flex-row-reverse lg:items-start lg:gap-8">
            {/* Profile Summary (right column on desktop) */}
            <aside className="w-full lg:w-1/3">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-28 w-28 rounded-full bg-emerald-50 flex items-center justify-center text-3xl font-bold text-foreground overflow-hidden">
                    {profileImageSrc && !isAvatarFailed ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profileImageSrc}
                        alt={`الصورة الشخصية لـ ${profileQuery.data.user.name}`}
                        className="h-full w-full object-cover"
                        onError={() => setFailedAvatarSrc(profileImageSrc)}
                      />
                    ) : (
                      <span className="text-3xl">{profileInitial}</span>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{profileQuery.data.user.name}</p>
                    <p className="mt-1 text-sm text-gray-500">{profileQuery.data.user.email}</p>
                  </div>

                  <div className="w-full flex gap-3 mt-4">
                    <div className="flex-1 rounded-lg bg-gray-50 p-3 text-center">
                      <p className="text-xs text-text-secondary">تاريخ الانضمام</p>
                      <p className="mt-1 text-base font-semibold text-foreground">{formatDate(profileQuery.data.joinedAt)}</p>
                    </div>
                    <div className="flex-1 rounded-lg bg-gray-50 p-3 text-center">
                      <p className="text-xs text-text-secondary">ساعات التطوع</p>
                      <p className="mt-1 text-base font-semibold text-foreground">{profileQuery.data.totalHours}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 w-full mt-4">
                    <div className="rounded-lg bg-emerald-50 p-3 text-center">
                      <p className="text-lg font-bold text-emerald-700">{profileQuery.data.completedOpportunities}</p>
                      <p className="text-xs text-text-secondary">مقبول</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <p className="text-lg font-bold text-foreground">{profileQuery.data.pendingApplications}</p>
                      <p className="text-xs text-text-secondary">قيد المراجعة</p>
                    </div>
                    <div className="rounded-lg bg-red-50 p-3 text-center">
                      <p className="text-lg font-bold text-red-600">{profileQuery.data.cancelledApplications}</p>
                      <p className="text-xs text-text-secondary">مرفوض</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Edit Form (left column on desktop) */}
            <div className="w-full lg:w-2/3">
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                  <div className="grid gap-2">
                    <label htmlFor="image" className="text-sm font-semibold text-foreground">رابط الصورة الشخصية</label>
                    <input
                      id="image"
                      placeholder="https://..."
                      className="w-full rounded-lg bg-gray-50 border border-transparent p-3 text-sm text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      {...register("image")}
                    />
                    {errors.image ? <p className="text-sm text-red-600">{errors.image.message}</p> : null}
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="bio" className="text-sm font-semibold text-foreground">نبذة عنك</label>
                    <textarea
                      id="bio"
                      rows={4}
                      className="w-full rounded-lg bg-gray-50 border border-transparent p-3 text-sm text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      {...register("bio")}
                    />
                    {errors.bio ? <p className="text-sm text-red-600">{errors.bio.message}</p> : null}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <label htmlFor="skillsText" className="text-sm font-semibold text-foreground">المهارات (مفصولة بفاصلة)</label>
                      <input
                        id="skillsText"
                        placeholder="إدارة فريق، تنظيم، تواصل"
                        className="w-full rounded-lg bg-gray-50 border border-transparent p-3 text-sm text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        {...register("skillsText")}
                      />
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="interestsText" className="text-sm font-semibold text-foreground">الاهتمامات (مفصولة بفاصلة)</label>
                      <input
                        id="interestsText"
                        placeholder="تعليم، صحة، بيئة"
                        className="w-full rounded-lg bg-gray-50 border border-transparent p-3 text-sm text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        {...register("interestsText")}
                      />
                    </div>
                  </div>

                  {globalError ? (
                    <div role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{globalError}</div>
                  ) : null}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || updateProfileMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white transform transition hover:-translate-y-1 hover:shadow-lg disabled:opacity-70"
                    >
                      {isSubmitting || updateProfileMutation.isPending ? "جارٍ الحفظ..." : "حفظ التعديلات"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}


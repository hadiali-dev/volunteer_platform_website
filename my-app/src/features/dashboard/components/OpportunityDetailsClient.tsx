"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";

import { OpportunityComments } from "@/features/dashboard/components/OpportunityComments";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import {
  useAddOpportunityComment,
  useAddOpportunityReply,
  useApplyToOpportunity,
  useDeleteOpportunityComment,
  useNotifications,
  useOpportunityById,
  useToggleOpportunityLike,
} from "@/features/dashboard/hooks";
import { formatDate } from "@/lib/utils";
import { AppError } from "@/types";

interface OpportunityDetailsClientProps {
  opportunityId: string;
}

const PLACEHOLDER_IMAGES = [
  "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/6995030/pexels-photo-6995030.jpeg?auto=compress&cs=tinysrgb&w=2000",
] as const;

const FALLBACK_IMAGE = PLACEHOLDER_IMAGES[0];

const CATEGORY_LABELS = {
  educational: "تعليمي",
  health: "صحي",
  environmental: "بيئي",
  social: "اجتماعي",
} as const;

const getPlaceholderImage = (seed: string): string => {
  const normalizedSeed = seed.trim();
  const hash = Array.from(normalizedSeed).reduce((accumulator, char) => {
    return accumulator + char.charCodeAt(0);
  }, 0);

  return PLACEHOLDER_IMAGES[hash % PLACEHOLDER_IMAGES.length] ?? FALLBACK_IMAGE;
};

const resolveImageSrc = (
  image: string | null | undefined,
  placeholderSeed: string,
): string => {
  if (typeof image !== "string") {
    return getPlaceholderImage(placeholderSeed);
  }

  const trimmedImage = image.trim();
  return trimmedImage.length > 0 ? trimmedImage : getPlaceholderImage(placeholderSeed);
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError || error instanceof Error) {
    return error.message;
  }

  return "حدث خطأ غير متوقع. حاول مرة أخرى.";
};

export function OpportunityDetailsClient({
  opportunityId,
}: OpportunityDetailsClientProps): ReactElement {
  const { data: sessionData } = useSession();
  const [isApplyConfirmOpen, setIsApplyConfirmOpen] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const notificationsQuery = useNotifications();
  const opportunityQuery = useOpportunityById(opportunityId);
  const likeMutation = useToggleOpportunityLike();
  const addCommentMutation = useAddOpportunityComment();
  const addReplyMutation = useAddOpportunityReply();
  const deleteCommentMutation = useDeleteOpportunityComment();
  const applyMutation = useApplyToOpportunity();

  const unreadNotificationsCount = useMemo(() => {
    const list = notificationsQuery.data ?? [];
    return list.filter((item) => !item.isRead).length;
  }, [notificationsQuery.data]);

  const currentUserId = sessionData?.user.id;
  const isStudent = sessionData?.user.role === "student";
  const opportunity = opportunityQuery.data;
  const isLiked = Boolean(
    opportunity?.likes.some((like) => like.user._id === currentUserId),
  );

  const commentSubmitError = addCommentMutation.isError
    ? getErrorMessage(addCommentMutation.error)
    : null;

  const commentDeleteError = deleteCommentMutation.isError
    ? getErrorMessage(deleteCommentMutation.error)
    : null;

  const replySubmitError = addReplyMutation.isError
    ? getErrorMessage(addReplyMutation.error)
    : null;

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleLike = async (): Promise<void> => {
    await likeMutation.mutateAsync(opportunityId);
  };

  const handleApply = async (): Promise<void> => {
    try {
      await applyMutation.mutateAsync({ opportunityId });
      setToast({
        type: "success",
        message: "تم إرسال طلب التقديم بنجاح.",
      });
      setIsApplyConfirmOpen(false);
    } catch (error) {
      setToast({
        type: "error",
        message: getErrorMessage(error),
      });
    }
  };

  const handleSubmitComment = async (content: string): Promise<void> => {
    await addCommentMutation.mutateAsync({ id: opportunityId, content });
  };

  const handleDeleteComment = async (commentId: string): Promise<void> => {
    await deleteCommentMutation.mutateAsync({ id: opportunityId, commentId });
  };

  const handleSubmitReply = async (
    commentId: string,
    content: string,
  ): Promise<void> => {
    await addReplyMutation.mutateAsync({ id: opportunityId, commentId, content });
  };

  return (
    <>
      <DashboardHeader unreadNotificationsCount={unreadNotificationsCount} />

      <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
        <div className="mb-6">
          <Link
            href="/dashboard"
            prefetch
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-strong"
          >
            العودة إلى الفرص
          </Link>
        </div>

        {opportunityQuery.isPending ? (
          <div className="rounded-xl border border-border-soft bg-surface p-8 text-center text-sm text-text-secondary">
            جارٍ تحميل تفاصيل الفرصة...
          </div>
        ) : null}

        {opportunityQuery.isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {getErrorMessage(opportunityQuery.error)}
          </div>
        ) : null}

        {opportunity ? (
          <section className="grid gap-6">
            <article className="overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-[0_10px_24px_rgba(33,37,41,0.08)]">
              <div className="relative h-72 w-full">
                <Image
                  src={resolveImageSrc(opportunity.image, opportunity._id)}
                  alt={`صورة فرصة ${opportunity.title}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 right-0 p-6 text-white">
                  <span className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                    {CATEGORY_LABELS[opportunity.category]}
                  </span>
                  <h1 className="text-2xl font-bold sm:text-3xl">{opportunity.title}</h1>
                </div>
              </div>

              <div className="grid gap-6 p-6">
                <p className="text-base leading-8 text-foreground">{opportunity.description}</p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-accent-soft/70 p-3 text-sm">
                    <p className="text-text-secondary">الموقع</p>
                    <p className="font-semibold text-foreground">{opportunity.location}</p>
                  </div>
                  <div className="rounded-xl bg-accent-soft/70 p-3 text-sm">
                    <p className="text-text-secondary">التاريخ</p>
                    <p className="font-semibold text-foreground">{formatDate(opportunity.date)}</p>
                  </div>
                  <div className="rounded-xl bg-accent-soft/70 p-3 text-sm">
                    <p className="text-text-secondary">عدد المتطوعين</p>
                    <p className="font-semibold text-foreground">{opportunity.maxVolunteers}</p>
                  </div>
                  <div className="rounded-xl bg-accent-soft/70 p-3 text-sm">
                    <p className="text-text-secondary">الساعات</p>
                    <p className="font-semibold text-foreground">{opportunity.hours ?? 0}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void handleLike()}
                    disabled={likeMutation.isPending}
                    className="inline-flex h-11 items-center gap-2 rounded-lg border border-border-soft bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className={isLiked ? "text-red-500" : "text-foreground"}>♥</span>
                    {isLiked ? "إلغاء الإعجاب" : "إعجاب"} ({opportunity.likes.length})
                  </button>

                  {isStudent ? (
                    <button
                      type="button"
                      onClick={() => setIsApplyConfirmOpen(true)}
                      disabled={applyMutation.isPending}
                      className="inline-flex h-11 items-center justify-center rounded-lg bg-accent px-5 text-sm font-bold text-white transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {applyMutation.isPending ? "جاري التقديم..." : "قدّم الآن"}
                    </button>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
                  <span>الجهة: {opportunity.organization?.name ?? "غير محدد"}</span>
                  <span>•</span>
                  <span>{opportunity.comments.length} تعليق</span>
                  <span>•</span>
                  <span>{opportunity.likes.length} إعجاب</span>
                </div>
              </div>
            </article>

            <OpportunityComments
              comments={opportunity.comments}
              {...(currentUserId ? { currentUserId } : {})}
              isSubmitting={addCommentMutation.isPending}
              isReplySubmitting={addReplyMutation.isPending}
              submitError={commentSubmitError}
              replySubmitError={replySubmitError}
              deleteError={commentDeleteError}
              onSubmit={handleSubmitComment}
              onReplySubmit={handleSubmitReply}
              onDelete={handleDeleteComment}
            />
          </section>
        ) : null}
      </main>

      {toast ? (
        <div className="pointer-events-none fixed left-1/2 top-6 z-[60] w-full max-w-md -translate-x-1/2 px-4">
          <div
            className={`rounded-xl border px-4 py-3 text-sm font-semibold shadow-[0_12px_30px_rgba(15,23,42,0.18)] ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}

      {isApplyConfirmOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
          <section className="w-full max-w-md rounded-2xl border border-border-soft bg-surface p-6 shadow-[0_16px_40px_rgba(15,23,42,0.28)]">
            <h3 className="text-lg font-bold text-foreground">تأكيد التقديم</h3>
            <p className="mt-2 text-sm leading-7 text-text-secondary">
              هل أنت متأكد أنك تريد التقديم على هذه الفرصة؟
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsApplyConfirmOpen(false)}
                disabled={applyMutation.isPending}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border-soft bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-slate-800"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => void handleApply()}
                disabled={applyMutation.isPending}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
              >
                {applyMutation.isPending ? "جاري التقديم..." : "تأكيد"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}


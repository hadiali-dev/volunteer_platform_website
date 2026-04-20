"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { formatDate } from "@/lib/utils";

import type { OpportunityComment } from "@/features/dashboard/schemas";

interface OpportunityCommentsProps {
  comments: OpportunityComment[];
  currentUserId?: string;
  isSubmitting: boolean;
  isReplySubmitting: boolean;
  submitError: string | null;
  replySubmitError: string | null;
  deleteError: string | null;
  onSubmit: (content: string) => Promise<void>;
  onReplySubmit: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

const CommentFormSchema = z.object({
  content: z.string().trim().min(1, "أدخل تعليقًا قبل الإرسال.").max(500),
});

const ReplyFormSchema = z.object({
  content: z.string().trim().min(1, "أدخل ردًا قبل الإرسال.").max(500),
});

type CommentFormInput = z.infer<typeof CommentFormSchema>;

interface UserAvatarProps {
  name: string;
  image: string | null | undefined;
  sizeClassName: string;
  textClassName: string;
}

function UserAvatar({
  name,
  image,
  sizeClassName,
  textClassName,
}: UserAvatarProps): ReactElement {
  const trimmedImage = image?.trim();
  const hasImage = typeof trimmedImage === "string" && trimmedImage.length > 0;
  const initial = name.trim().slice(0, 1) || "م";

  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-full bg-accent-soft ${sizeClassName}`}
    >
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={trimmedImage} alt={`صورة ${name}`} className="h-full w-full object-cover" />
      ) : (
        <span className={`font-bold text-emerald-800 ${textClassName}`}>{initial}</span>
      )}
    </span>
  );
}

export function OpportunityComments({
  comments,
  currentUserId,
  isSubmitting,
  isReplySubmitting,
  submitError,
  replySubmitError,
  deleteError,
  onSubmit,
  onReplySubmit,
  onDelete,
}: OpportunityCommentsProps): ReactElement {
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyErrors, setReplyErrors] = useState<Record<string, string | null>>({});

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<CommentFormInput>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleFormSubmit = async (values: CommentFormInput): Promise<void> => {
    await onSubmit(values.content);
    reset({ content: "" });
  };

  const handleReplyDraftChange = (commentId: string, value: string): void => {
    setReplyDrafts((current) => ({ ...current, [commentId]: value }));
    setReplyErrors((current) => ({ ...current, [commentId]: null }));
  };

  const toggleReplies = (commentId: string): void => {
    setExpandedReplies((current) => ({ ...current, [commentId]: !current[commentId] }));
  };

  const handleReplySubmit = async (commentId: string): Promise<void> => {
    const draftValue = replyDrafts[commentId] ?? "";
    const parsedReply = ReplyFormSchema.safeParse({ content: draftValue });
    if (!parsedReply.success) {
      const firstIssue = parsedReply.error.issues[0]?.message ?? "الرد غير صالح.";
      setReplyErrors((current) => ({ ...current, [commentId]: firstIssue }));
      return;
    }

    await onReplySubmit(commentId, parsedReply.data.content);
    setReplyDrafts((current) => ({ ...current, [commentId]: "" }));
    setReplyErrors((current) => ({ ...current, [commentId]: null }));
    setExpandedReplies((current) => ({ ...current, [commentId]: true }));
  };

  const repliesCountMap = useMemo(() => {
    return comments.reduce<Record<string, number>>((accumulator, comment) => {
      accumulator[comment._id] = comment.replies.length;
      return accumulator;
    }, {});
  }, [comments]);

  return (
    <section className="rounded-2xl border border-border-soft bg-surface p-6 shadow-[0_8px_20px_rgba(33,37,41,0.08)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-foreground">التعليقات</h2>
        <span className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong">
          {comments.length} تعليق
        </span>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-3">
        <label htmlFor="comment-content" className="text-sm font-medium text-foreground">
          اكتب تعليقك
        </label>
        <textarea
          id="comment-content"
          rows={3}
          className="w-full rounded-xl border border-border-soft bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder="شارك رأيك أو استفسارك حول الفرصة..."
          {...register("content")}
        />
        {errors.content ? <p className="text-sm text-red-600">{errors.content.message}</p> : null}

        {submitError ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
        ) : null}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isFormSubmitting}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting || isFormSubmitting ? "جارٍ الإرسال..." : "إرسال التعليق"}
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-3">
        {deleteError ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{deleteError}</p>
        ) : null}

        {replySubmitError ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{replySubmitError}</p>
        ) : null}

        {comments.length === 0 ? (
          <div className="rounded-xl bg-accent-soft/60 px-4 py-6 text-center text-sm text-text-secondary">
            لا توجد تعليقات بعد. كن أول من يضيف تعليقًا.
          </div>
        ) : null}

        {comments.map((comment) => {
          const canDelete = currentUserId === comment.user._id;
          const repliesCount = repliesCountMap[comment._id] ?? 0;
          const isRepliesOpen = Boolean(expandedReplies[comment._id]);
          const commentReplyError = replyErrors[comment._id];

          return (
            <article
              key={comment._id}
              className="rounded-xl border border-border-soft bg-background/40 p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={comment.user.name}
                    image={comment.user.image}
                    sizeClassName="h-10 w-10"
                    textClassName="text-sm"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{comment.user.name}</p>
                    <p className="text-xs text-text-secondary">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>

                {canDelete ? (
                  <button
                    type="button"
                    onClick={() => void onDelete(comment._id)}
                    className="text-xs font-semibold text-red-600 transition-colors hover:text-red-700"
                  >
                    حذف
                  </button>
                ) : null}
              </div>

              <p className="text-sm leading-7 text-foreground">{comment.content}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleReplies(comment._id)}
                  className="inline-flex h-8 items-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 transition hover:border-accent hover:text-accent"
                >
                  {isRepliesOpen ? "إخفاء الردود" : "قراءة الردود"}
                </button>
                <span className="inline-flex h-8 items-center rounded-lg bg-slate-100 px-2.5 text-xs font-semibold text-slate-700">
                  {repliesCount}
                </span>
              </div>

              <div className="mt-3 rounded-xl border border-border-soft/80 bg-surface p-3">
                <label
                  htmlFor={`reply-${comment._id}`}
                  className="mb-2 block text-xs font-semibold text-foreground"
                >
                  أضف ردًا
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                  <textarea
                    id={`reply-${comment._id}`}
                    rows={2}
                    value={replyDrafts[comment._id] ?? ""}
                    onChange={(event) =>
                      handleReplyDraftChange(comment._id, event.target.value)
                    }
                    className="w-full rounded-lg border border-border-soft bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="اكتب ردك هنا..."
                  />
                  <button
                    type="button"
                    onClick={() => void handleReplySubmit(comment._id)}
                    disabled={isReplySubmitting}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isReplySubmitting ? "جارٍ الإرسال..." : "إرسال الرد"}
                  </button>
                </div>
                {commentReplyError ? (
                  <p className="mt-2 text-sm text-red-600">{commentReplyError}</p>
                ) : null}
              </div>

              {isRepliesOpen ? (
                <div className="mt-3 grid gap-2 border-r-2 border-emerald-100 pr-3">
                  {comment.replies.length === 0 ? (
                    <p className="text-xs text-text-secondary">لا توجد ردود لهذا التعليق بعد.</p>
                  ) : null}

                  {comment.replies.map((reply) => (
                    <div
                      key={reply._id}
                      className="rounded-lg border border-border-soft bg-surface px-3 py-2"
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <UserAvatar
                          name={reply.user.name}
                          image={reply.user.image}
                          sizeClassName="h-7 w-7"
                          textClassName="text-xs"
                        />
                        <p className="text-xs font-semibold text-foreground">{reply.user.name}</p>
                        <span className="text-[11px] text-text-secondary">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-foreground">{reply.content}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

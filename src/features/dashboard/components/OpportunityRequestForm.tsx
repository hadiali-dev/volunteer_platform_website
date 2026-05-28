"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactElement } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useSubmitOpportunityRequest } from "@/features/dashboard/hooks";
import {
  OpportunityRequestFormSchema,
  type OpportunityRequestFormInput,
  type OpportunityRequestFormValues,
  type OpportunityRequestInput,
} from "@/features/dashboard/schemas";

const categoryOptions: Array<{
  label: string;
  value: OpportunityRequestInput["category"];
}> = [
  { label: "تعليمي", value: "educational" },
  { label: "صحي", value: "health" },
  { label: "بيئي", value: "environmental" },
  { label: "اجتماعي", value: "social" },
];

const toRequestPayload = (
  values: OpportunityRequestFormInput,
): OpportunityRequestInput => {
  const requiredSkills = (values.requiredSkillsText ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  const payload: OpportunityRequestInput = {
    title: values.title,
    description: values.description,
    location: values.location,
    category: values.category,
    requiredSkills,
    date: values.date,
    maxVolunteers: values.maxVolunteers,
    status: "open",
  };

  if (typeof values.hours === "number" && !Number.isNaN(values.hours)) {
    payload.hours = values.hours;
  }

  if (values.image && values.image.length > 0) {
    payload.image = values.image;
  }

  return payload;
};

const fieldClassName =
  "h-11 w-full rounded-lg border border-border-soft bg-surface px-3 text-sm text-foreground outline-none transition-colors focus:border-2 focus:border-accent";

interface OpportunityRequestFormProps {
  variant?: "default" | "hero";
}

export function OpportunityRequestForm({ variant = "default" }: OpportunityRequestFormProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const mutation = useSubmitOpportunityRequest();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<
    OpportunityRequestFormValues,
    undefined,
    OpportunityRequestFormInput
  >({
    resolver: zodResolver(OpportunityRequestFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      category: "social",
      requiredSkillsText: "",
      date: "",
      maxVolunteers: 10,
      hours: 2,
      image: "",
    },
  });

  const onSubmit = async (values: OpportunityRequestFormInput): Promise<void> => {
    await mutation.mutateAsync(toRequestPayload(values));
    reset();
    setIsOpen(false);
  };

  const toggleBtnClass =
    variant === "hero"
      ? "inline-flex h-12 items-center justify-center rounded-lg bg-accent px-5 text-base font-semibold text-white transition-colors hover:bg-accent-strong shadow-md"
      : "inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-strong";

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
        className={toggleBtnClass}
      >
        إضافة طلب فرصة
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-950/45 p-4">
          <div className="grid min-h-full place-items-center py-4">
            <section className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-border-soft bg-surface p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-foreground">إضافة طلب فرصة جديدة</h2>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="إغلاق"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium text-foreground">
                    عنوان الفرصة
                  </label>
                  <input id="title" className={fieldClassName} {...register("title")} />
                  {errors.title ? (
                    <p className="text-xs text-red-600">{errors.title.message}</p>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium text-foreground">
                    وصف الفرصة
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className="w-full rounded-lg border border-border-soft bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-2 focus:border-accent"
                    {...register("description")}
                  />
                  {errors.description ? (
                    <p className="text-xs text-red-600">{errors.description.message}</p>
                  ) : null}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="location" className="text-sm font-medium text-foreground">
                      الموقع
                    </label>
                    <input id="location" className={fieldClassName} {...register("location")} />
                    {errors.location ? (
                      <p className="text-xs text-red-600">{errors.location.message}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="category" className="text-sm font-medium text-foreground">
                      التصنيف
                    </label>
                    <select id="category" className={fieldClassName} {...register("category")}>
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="grid gap-2">
                    <label htmlFor="date" className="text-sm font-medium text-foreground">
                      التاريخ
                    </label>
                    <input id="date" type="date" className={fieldClassName} {...register("date")} />
                    {errors.date ? (
                      <p className="text-xs text-red-600">{errors.date.message}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="maxVolunteers"
                      className="text-sm font-medium text-foreground"
                    >
                      الحد الأقصى للمتطوعين
                    </label>
                    <input
                      id="maxVolunteers"
                      type="number"
                      min={1}
                      className={fieldClassName}
                      {...register("maxVolunteers")}
                    />
                    {errors.maxVolunteers ? (
                      <p className="text-xs text-red-600">{errors.maxVolunteers.message}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="hours" className="text-sm font-medium text-foreground">
                      عدد الساعات
                    </label>
                    <input
                      id="hours"
                      type="number"
                      min={0}
                      className={fieldClassName}
                      {...register("hours")}
                    />
                    {errors.hours ? (
                      <p className="text-xs text-red-600">{errors.hours.message}</p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label
                      htmlFor="requiredSkillsText"
                      className="text-sm font-medium text-foreground"
                    >
                      المهارات (مفصولة بفاصلة)
                    </label>
                    <input
                      id="requiredSkillsText"
                      placeholder="تنظيم، إدارة فريق، تواصل"
                      className={fieldClassName}
                      {...register("requiredSkillsText")}
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="image" className="text-sm font-medium text-foreground">
                      رابط صورة (اختياري)
                    </label>
                    <input
                      id="image"
                      placeholder="https://..."
                      className={fieldClassName}
                      {...register("image")}
                    />
                    {errors.image ? (
                      <p className="text-xs text-red-600">{errors.image.message}</p>
                    ) : null}
                  </div>
                </div>

                {mutation.isError ? (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    تعذر إرسال الطلب. تأكد من البيانات ثم حاول مرة أخرى.
                  </p>
                ) : null}

                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-70"
                  >
                    {mutation.isPending ? "جارٍ الإرسال..." : "إرسال الطلب"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-border-soft bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      ) : null}
    </>
  );
}

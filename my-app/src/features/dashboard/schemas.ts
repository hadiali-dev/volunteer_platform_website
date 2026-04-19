import { z } from "zod";

export const OpportunityCategorySchema = z.enum([
  "educational",
  "health",
  "environmental",
  "social",
]);

export const OpportunityOrganizationSchema = z.object({
  _id: z.string(),
  name: z.string(),
  image: z.string().nullable().optional(),
});

export const OpportunityUserSummarySchema = z.object({
  _id: z.string(),
  name: z.string(),
  image: z.string().nullable().optional(),
});

export const OpportunityLikeSchema = z.object({
  _id: z.string(),
  user: OpportunityUserSummarySchema,
  likedAt: z.string(),
});

export const OpportunityCommentSchema = z.object({
  _id: z.string(),
  user: OpportunityUserSummarySchema,
  content: z.string(),
  createdAt: z.string(),
  replies: z
    .array(
      z.object({
        _id: z.string(),
        user: OpportunityUserSummarySchema,
        content: z.string(),
        createdAt: z.string(),
      }),
    )
    .default([]),
});

export const OpportunitySchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().nullable(),
  location: z.string(),
  category: OpportunityCategorySchema,
  requiredSkills: z.array(z.string()),
  date: z.string(),
  hours: z.number().int().nonnegative().optional(),
  status: z.enum(["open", "closed"]),
  maxVolunteers: z.number().int().nonnegative(),
  likes: z.array(OpportunityLikeSchema).default([]),
  comments: z.array(OpportunityCommentSchema).default([]),
  organization: OpportunityOrganizationSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const OpportunitiesResponseSchema = z.object({
  status: z.literal("success"),
  results: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  data: z.array(OpportunitySchema),
});

export const OpportunityDetailsResponseSchema = z.object({
  status: z.literal("success"),
  data: OpportunitySchema,
});

export const DashboardQuerySchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(12),
  search: z.string().trim().default(""),
  category: OpportunityCategorySchema.optional(),
  location: z.string().trim().default(""),
  skill: z.string().trim().default(""),
});

export const NotificationSchema = z.object({
  _id: z.string(),
  message: z.string(),
  type: z
    .enum(["general", "application_accepted", "application_rejected"])
    .default("general"),
  isRead: z.boolean(),
  createdAt: z.string(),
});

export const RawApplicationStatusSchema = z.enum([
  "pending",
  "accepted",
  "approved",
  "rejected",
]);

export const ApplicationStatusSchema = RawApplicationStatusSchema.transform((status) =>
  status === "approved" ? "accepted" : status,
);

export const ApplicationOpportunitySchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().nullable().optional(),
  location: z.string(),
  category: OpportunityCategorySchema.optional(),
  requiredSkills: z.array(z.string()).default([]),
  date: z.string(),
  hours: z.number().int().nonnegative().optional(),
  status: z.enum(["open", "closed"]).optional(),
  maxVolunteers: z.number().int().nonnegative().optional(),
  organization: OpportunityOrganizationSchema.optional(),
});

export const ApplicationSchema = z.object({
  _id: z.string(),
  status: ApplicationStatusSchema,
  appliedAt: z.string(),
  opportunity: ApplicationOpportunitySchema,
});

export const MyApplicationsQuerySchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(9),
  status: ApplicationStatusSchema.or(z.literal("all")).default("all"),
});

export const MyApplicationsResponseSchema = z.object({
  status: z.literal("success"),
  results: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  data: z.array(ApplicationSchema),
});

export const NotificationsResponseSchema = z.object({
  status: z.literal("success"),
  data: z.array(NotificationSchema),
});

export const ProfileUserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["student", "organization", "admin"]).or(z.string()),
  image: z.string().nullable().optional(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const VolunteerProfileSchema = z.object({
  _id: z.string(),
  user: ProfileUserSchema,
  image: z.string().nullable().optional(),
  skills: z.array(z.string()),
  interests: z.array(z.string()),
  bio: z.string(),
  totalHours: z.number().nonnegative(),
  completedOpportunities: z.number().int().nonnegative(),
  pendingApplications: z.number().int().nonnegative(),
  cancelledApplications: z.number().int().nonnegative(),
  joinedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const VolunteerProfileResponseSchema = z.object({
  status: z.literal("success"),
  data: VolunteerProfileSchema,
});

export const UpdateVolunteerProfileInputSchema = z.object({
  image: z.string().trim().url().optional(),
  bio: z.string().trim().max(500).optional(),
  skills: z.array(z.string().trim().min(1)).optional(),
  interests: z.array(z.string().trim().min(1)).optional(),
});

export const VolunteerProfileFormSchema = z.object({
  image: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) =>
        value === undefined || value.length === 0 || z.url().safeParse(value).success,
      {
        message: "رابط الصورة غير صالح.",
      },
    ),
  bio: z.string().trim().max(500, "السيرة الذاتية يجب ألا تتجاوز 500 حرف.").optional(),
  skillsText: z.string().trim().optional(),
  interestsText: z.string().trim().optional(),
});

export const AnnouncementSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  backgroundImage: z.string().url(),
  ctaUrl: z.string().trim().url().or(z.literal("")).optional(),
  ctaLabel: z.string().trim().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ActiveAnnouncementResponseSchema = z.object({
  status: z.literal("success"),
  data: AnnouncementSchema.nullable(),
});

export const MarkNotificationReadInputSchema = z.object({
  id: z.string().min(1),
});

export const MarkNotificationReadResponseSchema = z.object({
  status: z.literal("success"),
  data: NotificationSchema,
});

export const OpportunityRequestInputSchema = z.object({
  title: z.string().trim().min(5),
  description: z.string().trim().min(20),
  location: z.string().trim().min(3),
  category: OpportunityCategorySchema,
  requiredSkills: z.array(z.string().trim().min(1)).default([]),
  date: z
    .string()
    .trim()
    .refine((value) => !Number.isNaN(Date.parse(value))),
  maxVolunteers: z.number().int().min(1),
  hours: z.number().int().min(0).optional(),
  image: z.string().trim().url().optional(),
  status: z.enum(["open", "closed"]).optional(),
});

export const OpportunityRequestFormSchema = z.object({
  title: z.string().trim().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل."),
  description: z.string().trim().min(20, "الوصف يجب أن يكون 20 حرفًا على الأقل."),
  location: z.string().trim().min(3, "الموقع مطلوب."),
  category: OpportunityCategorySchema,
  requiredSkillsText: z.string().trim().optional(),
  date: z.string().trim().min(1, "تاريخ الفرصة مطلوب."),
  maxVolunteers: z.coerce.number().int().min(1, "يجب أن يكون العدد 1 على الأقل."),
  hours: z.coerce.number().int().min(0, "الساعات لا يمكن أن تكون سالبة.").optional(),
  image: z
    .string()
    .trim()
    .optional()
    .refine((value) => value === undefined || value.length === 0 || z.url().safeParse(value).success, {
      message: "رابط الصورة غير صالح.",
    }),
});

export const OpportunityRequestResponseSchema = z.object({
  status: z.literal("success"),
  message: z.string().optional(),
  data: OpportunitySchema,
});

export const ToggleOpportunityLikeInputSchema = z.object({
  id: z.string().min(1),
});

export const ToggleOpportunityLikeResponseSchema = z.object({
  status: z.literal("success"),
  data: OpportunitySchema,
});

export const AddOpportunityCommentInputSchema = z.object({
  id: z.string().min(1),
  content: z.string().trim().min(1).max(500),
});

export const AddOpportunityCommentResponseSchema = z.object({
  status: z.literal("success"),
  data: OpportunitySchema,
});

export const DeleteOpportunityCommentInputSchema = z.object({
  id: z.string().min(1),
  commentId: z.string().min(1),
});

export const DeleteOpportunityCommentResponseSchema = z.object({
  status: z.literal("success"),
  data: OpportunitySchema,
});

export const AddOpportunityReplyInputSchema = z.object({
  id: z.string().min(1),
  commentId: z.string().min(1),
  content: z.string().trim().min(1).max(500),
});

export const AddOpportunityReplyResponseSchema = z.object({
  status: z.literal("success"),
  data: OpportunitySchema,
});

export const ApplyToOpportunityInputSchema = z.object({
  opportunityId: z.string().min(1),
});

export const ApplicationSubmissionSchema = z.object({
  _id: z.string(),
  opportunity: z.string(),
  volunteer: z.string(),
  status: ApplicationStatusSchema,
  appliedAt: z.string(),
});

export const ApplyToOpportunityResponseSchema = z.object({
  status: z.literal("success"),
  data: ApplicationSubmissionSchema,
});

export type Opportunity = z.infer<typeof OpportunitySchema>;
export type OpportunitiesResponse = z.infer<typeof OpportunitiesResponseSchema>;
export type OpportunityLike = z.infer<typeof OpportunityLikeSchema>;
export type OpportunityComment = z.infer<typeof OpportunityCommentSchema>;
export type OpportunityCategory = z.infer<typeof OpportunityCategorySchema>;
export type DashboardQuery = z.infer<typeof DashboardQuerySchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;
export type Application = z.infer<typeof ApplicationSchema>;
export type MyApplicationsQuery = z.infer<typeof MyApplicationsQuerySchema>;
export type MyApplicationsResponse = z.infer<typeof MyApplicationsResponseSchema>;
export type Announcement = z.infer<typeof AnnouncementSchema>;
export type VolunteerProfile = z.infer<typeof VolunteerProfileSchema>;
export type UpdateVolunteerProfileInput = z.infer<typeof UpdateVolunteerProfileInputSchema>;
export type VolunteerProfileFormInput = z.infer<typeof VolunteerProfileFormSchema>;
export type OpportunityRequestInput = z.infer<typeof OpportunityRequestInputSchema>;
export type OpportunityRequestFormInput = z.infer<typeof OpportunityRequestFormSchema>;
export type OpportunityRequestFormValues = z.input<typeof OpportunityRequestFormSchema>;
export type AddOpportunityCommentInput = z.infer<typeof AddOpportunityCommentInputSchema>;
export type AddOpportunityReplyInput = z.infer<typeof AddOpportunityReplyInputSchema>;
export type ApplyToOpportunityInput = z.infer<typeof ApplyToOpportunityInputSchema>;

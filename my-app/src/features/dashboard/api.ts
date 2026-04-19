import { api } from "@/lib/api";
import { z } from "zod";

import {
  AddOpportunityCommentInputSchema,
  AddOpportunityReplyInputSchema,
  ApplicationSchema,
  AddOpportunityCommentResponseSchema,
  AddOpportunityReplyResponseSchema,
  ActiveAnnouncementResponseSchema,
  ApplyToOpportunityInputSchema,
  ApplyToOpportunityResponseSchema,
  DashboardQuerySchema,
  DeleteOpportunityCommentInputSchema,
  DeleteOpportunityCommentResponseSchema,
  MarkNotificationReadInputSchema,
  MarkNotificationReadResponseSchema,
  MyApplicationsQuerySchema,
  MyApplicationsResponseSchema,
  NotificationsResponseSchema,
  OpportunityDetailsResponseSchema,
  OpportunitiesResponseSchema,
  OpportunityRequestInputSchema,
  OpportunityRequestResponseSchema,
  ToggleOpportunityLikeInputSchema,
  ToggleOpportunityLikeResponseSchema,
  UpdateVolunteerProfileInputSchema,
  VolunteerProfileResponseSchema,
  type AddOpportunityCommentInput,
  type AddOpportunityReplyInput,
  type ApplyToOpportunityInput,
  type DashboardQuery,
  type MyApplicationsQuery,
  type MyApplicationsResponse,
  type Announcement,
  type Notification,
  type Opportunity,
  type OpportunityRequestInput,
  type UpdateVolunteerProfileInput,
  type VolunteerProfile,
  type OpportunitiesResponse,
} from "@/features/dashboard/schemas";

export const getOpportunities = async (
  rawQuery: Partial<DashboardQuery>,
): Promise<OpportunitiesResponse> => {
  const query = DashboardQuerySchema.parse(rawQuery);
  const hasSearch = query.search.length > 0;
  const categoryParam = query.category;
  const locationParam = query.location.length > 0 ? query.location : undefined;
  const skillParam = query.skill.length > 0 ? query.skill : undefined;

  const response = hasSearch
    ? await api.get("/api/v1/search", {
        params: {
          search: query.search,
          page: query.page,
          limit: query.limit,
          category: categoryParam,
          location: locationParam,
          skill: skillParam,
        },
      })
    : await api.get("/api/v1/opportunities", {
        params: {
          page: query.page,
          limit: query.limit,
          category: categoryParam,
          location: locationParam,
          skill: skillParam,
        },
      });

  return OpportunitiesResponseSchema.parse(response.data);
};

export const getOpportunityById = async (id: string): Promise<Opportunity> => {
  const parsedId = ToggleOpportunityLikeInputSchema.parse({ id });
  const response = await api.get(`/api/v1/opportunities/${parsedId.id}`);
  const parsed = OpportunityDetailsResponseSchema.parse(response.data);
  return parsed.data;
};

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get("/api/v1/notifications");
  const parsed = NotificationsResponseSchema.parse(response.data);
  return parsed.data;
};

export const getMyApplications = async (
  rawQuery: Partial<MyApplicationsQuery>,
): Promise<MyApplicationsResponse> => {
  const query = MyApplicationsQuerySchema.parse(rawQuery);
  const statusParam = query.status === "all" ? undefined : query.status;

  const response = await api.get("/api/v1/my-applications", {
    params: {
      page: query.page,
      limit: query.limit,
      status: statusParam,
    },
  });

  const envelope = z
    .object({
      status: z.literal("success"),
      results: z.number().int().nonnegative(),
      page: z.number().int().positive(),
      total: z.number().int().nonnegative(),
      data: z.array(z.unknown()),
    })
    .parse(response.data);

  const parsedApplications = envelope.data.flatMap((application) => {
    const parsed = ApplicationSchema.safeParse(application);
    return parsed.success ? [parsed.data] : [];
  });

  return MyApplicationsResponseSchema.parse({
    ...envelope,
    results: parsedApplications.length,
    data: parsedApplications,
  });
};

export const getMyProfile = async (): Promise<VolunteerProfile> => {
  const response = await api.get("/api/v1/profile");
  const parsed = VolunteerProfileResponseSchema.parse(response.data);
  return parsed.data;
};

export const updateMyProfile = async (
  payload: UpdateVolunteerProfileInput,
): Promise<VolunteerProfile> => {
  const parsedPayload = UpdateVolunteerProfileInputSchema.parse(payload);
  await api.patch("/api/v1/profile", parsedPayload);
  return getMyProfile();
};

export const getActiveAnnouncement = async (): Promise<Announcement | null> => {
  const response = await api.get("/api/v1/announcements/active");
  const parsed = ActiveAnnouncementResponseSchema.parse(response.data);
  return parsed.data;
};

export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  const payload = MarkNotificationReadInputSchema.parse({ id });
  const response = await api.patch(`/api/v1/notifications/${payload.id}/read`);
  const parsed = MarkNotificationReadResponseSchema.parse(response.data);
  return parsed.data;
};

export const submitOpportunityRequest = async (
  payload: OpportunityRequestInput,
): Promise<Opportunity> => {
  const parsedPayload = OpportunityRequestInputSchema.parse(payload);
  const response = await api.post("/api/v1/opportunities", parsedPayload);
  const parsed = OpportunityRequestResponseSchema.parse(response.data);
  return parsed.data;
};

export const toggleOpportunityLike = async (id: string): Promise<Opportunity> => {
  const parsedId = ToggleOpportunityLikeInputSchema.parse({ id });
  const response = await api.patch(`/api/v1/opportunities/${parsedId.id}/like`);
  const parsed = ToggleOpportunityLikeResponseSchema.parse(response.data);
  return parsed.data;
};

export const addOpportunityComment = async (
  payload: AddOpportunityCommentInput,
): Promise<Opportunity> => {
  const parsedPayload = AddOpportunityCommentInputSchema.parse(payload);
  const response = await api.post(`/api/v1/opportunities/${parsedPayload.id}/comments`, {
    content: parsedPayload.content,
  });
  const parsed = AddOpportunityCommentResponseSchema.parse(response.data);
  return parsed.data;
};

export const deleteOpportunityComment = async (
  id: string,
  commentId: string,
): Promise<Opportunity> => {
  const parsedPayload = DeleteOpportunityCommentInputSchema.parse({ id, commentId });
  const response = await api.delete(
    `/api/v1/opportunities/${parsedPayload.id}/comments/${parsedPayload.commentId}`,
  );
  const parsed = DeleteOpportunityCommentResponseSchema.parse(response.data);
  return parsed.data;
};

export const addOpportunityReply = async (
  payload: AddOpportunityReplyInput,
): Promise<Opportunity> => {
  const parsedPayload = AddOpportunityReplyInputSchema.parse(payload);
  const response = await api.post(
    `/api/v1/opportunities/${parsedPayload.id}/comments/${parsedPayload.commentId}/replies`,
    {
      content: parsedPayload.content,
    },
  );
  const parsed = AddOpportunityReplyResponseSchema.parse(response.data);
  return parsed.data;
};

export const applyToOpportunity = async (
  payload: ApplyToOpportunityInput,
): Promise<void> => {
  const parsedPayload = ApplyToOpportunityInputSchema.parse(payload);
  const response = await api.post("/api/v1/apply", parsedPayload);
  ApplyToOpportunityResponseSchema.parse(response.data);
};

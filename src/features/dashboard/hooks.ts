"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import {
  addOpportunityComment,
  addOpportunityReply,
  applyToOpportunity,
  deleteOpportunityComment,
  getOpportunityById,
  getNotifications,
  getOpportunities,
  getActiveAnnouncement,
  getMyApplications,
  getMyProfile,
  markNotificationAsRead,
  submitOpportunityRequest,
  toggleOpportunityLike,
  updateMyProfile,
} from "@/features/dashboard/api";
import {
  ApplyToOpportunityInputSchema,
  DashboardQuerySchema,
  DeleteOpportunityCommentInputSchema,
  MyApplicationsQuerySchema,
  type DashboardQuery,
  type AddOpportunityCommentInput,
  type AddOpportunityReplyInput,
  type ApplyToOpportunityInput,
  type MyApplicationsQuery,
  type MyApplicationsResponse,
  type Announcement,
  type Notification,
  type OpportunitiesResponse,
  type Opportunity,
  type OpportunityRequestInput,
  type UpdateVolunteerProfileInput,
  type VolunteerProfile,
} from "@/features/dashboard/schemas";

export interface MyApplicationsStatusCounts {
  pending: number;
  accepted: number;
  rejected: number;
  all: number;
}

export const OPPORTUNITIES_QUERY_KEY = "dashboard-opportunities";
export const NOTIFICATIONS_QUERY_KEY = "dashboard-notifications";
export const ACTIVE_ANNOUNCEMENT_QUERY_KEY = "dashboard-active-announcement";
export const MY_APPLICATIONS_QUERY_KEY = "dashboard-my-applications";
export const PROFILE_QUERY_KEY = "dashboard-profile";
export const OPPORTUNITY_DETAILS_QUERY_KEY = "dashboard-opportunity-details";

export const useDashboardOpportunities = (
  rawQuery: Partial<DashboardQuery>,
): UseQueryResult<OpportunitiesResponse, Error> => {
  const query = DashboardQuerySchema.parse(rawQuery);

  return useQuery({
    queryKey: [
      OPPORTUNITIES_QUERY_KEY,
      query.page,
      query.limit,
      query.search,
      query.category ?? "all",
      query.location,
      query.skill,
    ],
    queryFn: () => getOpportunities(query),
    staleTime: 1000 * 60,
  });
};

export const useOpportunityById = (id: string): UseQueryResult<Opportunity, Error> => {
  return useQuery({
    queryKey: [OPPORTUNITY_DETAILS_QUERY_KEY, id],
    queryFn: () => getOpportunityById(id),
    staleTime: 1000 * 30,
  });
};

export const useNotifications = (): UseQueryResult<Notification[], Error> => {
  return useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY],
    queryFn: getNotifications,
    staleTime: 1000 * 30,
  });
};

export const useMyApplications = (
  rawQuery: Partial<MyApplicationsQuery>,
): UseQueryResult<MyApplicationsResponse, Error> => {
  const query = MyApplicationsQuerySchema.parse(rawQuery);

  return useQuery({
    queryKey: [MY_APPLICATIONS_QUERY_KEY, query.page, query.limit, query.status],
    queryFn: () => getMyApplications(query),
    staleTime: 1000 * 60,
  });
};

export const useMyApplicationsStatusCounts = (): UseQueryResult<
  MyApplicationsStatusCounts,
  Error
> => {
  return useQuery({
    queryKey: [MY_APPLICATIONS_QUERY_KEY, "status-counts"],
    queryFn: async () => {
      const [pending, accepted, rejected] = await Promise.all([
        getMyApplications({ page: 1, limit: 1, status: "pending" }),
        getMyApplications({ page: 1, limit: 1, status: "accepted" }),
        getMyApplications({ page: 1, limit: 1, status: "rejected" }),
      ]);

      return {
        pending: pending.total,
        accepted: accepted.total,
        rejected: rejected.total,
        all: pending.total + accepted.total + rejected.total,
      };
    },
    staleTime: 1000 * 60,
  });
};

export const useMyProfile = (): UseQueryResult<VolunteerProfile, Error> => {
  return useQuery({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: getMyProfile,
    staleTime: 1000 * 60,
  });
};

export const useActiveAnnouncement = (): UseQueryResult<Announcement | null, Error> => {
  return useQuery({
    queryKey: [ACTIVE_ANNOUNCEMENT_QUERY_KEY],
    queryFn: getActiveAnnouncement,
    staleTime: 1000 * 60 * 2,
  });
};

export const useMarkNotificationAsRead = (): UseMutationResult<
  Notification,
  Error,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });
};

export const useSubmitOpportunityRequest = (): UseMutationResult<
  Opportunity,
  Error,
  OpportunityRequestInput
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitOpportunityRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OPPORTUNITIES_QUERY_KEY] });
    },
  });
};

export const useUpdateMyProfile = (): UseMutationResult<
  VolunteerProfile,
  Error,
  UpdateVolunteerProfileInput
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
    },
  });
};

export const useToggleOpportunityLike = (): UseMutationResult<
  Opportunity,
  Error,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleOpportunityLike,
    onSuccess: (updatedOpportunity) => {
      queryClient.invalidateQueries({ queryKey: [OPPORTUNITIES_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [OPPORTUNITY_DETAILS_QUERY_KEY, updatedOpportunity._id],
      });
    },
  });
};

export const useAddOpportunityComment = (): UseMutationResult<
  Opportunity,
  Error,
  AddOpportunityCommentInput
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOpportunityComment,
    onSuccess: (updatedOpportunity) => {
      queryClient.invalidateQueries({ queryKey: [OPPORTUNITIES_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [OPPORTUNITY_DETAILS_QUERY_KEY, updatedOpportunity._id],
      });
    },
  });
};

export const useAddOpportunityReply = (): UseMutationResult<
  Opportunity,
  Error,
  AddOpportunityReplyInput
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOpportunityReply,
    onSuccess: (updatedOpportunity) => {
      queryClient.invalidateQueries({ queryKey: [OPPORTUNITIES_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [OPPORTUNITY_DETAILS_QUERY_KEY, updatedOpportunity._id],
      });
    },
  });
};

export const useDeleteOpportunityComment = (): UseMutationResult<
  Opportunity,
  Error,
  { id: string; commentId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, commentId }) => {
      const parsedInput = DeleteOpportunityCommentInputSchema.parse({ id, commentId });
      return deleteOpportunityComment(parsedInput.id, parsedInput.commentId);
    },
    onSuccess: (updatedOpportunity) => {
      queryClient.invalidateQueries({ queryKey: [OPPORTUNITIES_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [OPPORTUNITY_DETAILS_QUERY_KEY, updatedOpportunity._id],
      });
    },
  });
};

export const useApplyToOpportunity = (): UseMutationResult<
  void,
  Error,
  ApplyToOpportunityInput
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => {
      const parsedPayload = ApplyToOpportunityInputSchema.parse(payload);
      return applyToOpportunity(parsedPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_APPLICATIONS_QUERY_KEY] });
    },
  });
};

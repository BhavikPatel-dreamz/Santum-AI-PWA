import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../config/baseQuery";

type ApiRecord = Record<string, unknown>;
type ApiList = ApiRecord[];

type LoginPayload = {
  mobile: string;
  password: string;
};

type VerifyOtpPayload = {
  otp: string;
};

type BasicProfilePayload = {
  firstName: string;
  lastName: string;
  dob: string;
};

type PreferredLanguagePayload = {
  preferredLanguage: string;
};

type InterestsPayload = {
  interests: string[];
};

type UpsertMoodCheckInPayload = {
  dateKey: string;
  happiness: number;
  stress: number;
  energy: number;
};

type CreateChatPayload = {
  user: string;
  title?: string;
  model?: string;
  planType?: string;
};

type PurchaseSubscriptionPayload = {
  plan: ApiRecord;
};

type UpdateChatPayload = {
  chatId: string;
  updates: ApiRecord;
};

type CreateMessagePayload = {
  chatId: string;
  role: string;
  content: string;
};

function noStoreGet(url: string) {
  return {
    url,
    method: "GET" as const,
    cache: "no-store" as const,
  };
}

function extractProfile(payload: unknown): ApiRecord | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const record = payload as ApiRecord;

  if (record.user && typeof record.user === "object" && !Array.isArray(record.user)) {
    return record.user as ApiRecord;
  }

  if (record.data && typeof record.data === "object" && !Array.isArray(record.data)) {
    return record.data as ApiRecord;
  }

  return record;
}

function extractPlans(payload: unknown): ApiList {
  if (Array.isArray(payload)) {
    return payload as ApiList;
  }

  if (payload && typeof payload === "object") {
    const record = payload as ApiRecord;

    if (Array.isArray(record.data)) {
      return record.data;
    }

    if (Array.isArray(record.plans)) {
      return record.plans;
    }
  }

  return [];
}

function extractChat(payload: unknown): ApiRecord | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as ApiRecord;

  if (record.chat && typeof record.chat === "object") {
    return record.chat as ApiRecord;
  }

  if (record.data && typeof record.data === "object") {
    return record.data as ApiRecord;
  }

  return record;
}

function extractChats(payload: unknown): ApiList {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as ApiRecord;

  if (Array.isArray(record.chats)) {
    return record.chats as ApiList;
  }

  return Array.isArray(payload) ? (payload as ApiList) : [];
}

function extractMessages(payload: unknown): ApiList {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as ApiRecord;

  if (Array.isArray(record.messages)) {
    return record.messages as ApiList;
  }

  return Array.isArray(payload) ? (payload as ApiList) : [];
}

function extractMoodCheckIn(payload: unknown): ApiRecord | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const record = payload as ApiRecord;

  if ("entry" in record) {
    return record.entry &&
      typeof record.entry === "object" &&
      !Array.isArray(record.entry)
      ? (record.entry as ApiRecord)
      : null;
  }

  if ("data" in record) {
    return record.data &&
      typeof record.data === "object" &&
      !Array.isArray(record.data)
      ? (record.data as ApiRecord)
      : null;
  }

  return record;
}

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery,
  tagTypes: [
    "Profile",
    "Credits",
    "Plans",
    "Chats",
    "Chat",
    "Messages",
    "Mood",
  ],
  endpoints: (builder) => ({
    login: builder.mutation<ApiRecord, LoginPayload>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<ApiRecord, LoginPayload>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    verifyMobile: builder.mutation<ApiRecord, VerifyOtpPayload>({
      query: (body) => ({
        url: "/auth/verify-mobile",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<ApiRecord, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Profile", "Credits", "Plans", "Chats", "Chat", "Messages"],
    }),
    getProfile: builder.query<ApiRecord | null, void>({
      query: () => noStoreGet("/user/profile"),
      transformResponse: (response: unknown) => {
        const payload =
          response && typeof response === "object" && "data" in (response as ApiRecord)
            ? (response as ApiRecord).data
            : response;

        return extractProfile(payload);
      },
      providesTags: ["Profile"],
    }),
    updateBasicProfile: builder.mutation<ApiRecord, BasicProfilePayload>({
      query: (body) => ({
        url: "/user/profile/basic",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    updatePreferredLanguage: builder.mutation<
      ApiRecord,
      PreferredLanguagePayload
    >({
      query: (body) => ({
        url: "/user/profile/language",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    updateInterests: builder.mutation<ApiRecord, InterestsPayload>({
      query: (body) => ({
        url: "/user/profile/interests",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    getMoodCheckIn: builder.query<ApiRecord | null, string>({
      query: (dateKey) =>
        noStoreGet(`/mood-checkin?date=${encodeURIComponent(dateKey)}`),
      transformResponse: (response: unknown) => extractMoodCheckIn(response),
      providesTags: (result, error, dateKey) => [{ type: "Mood", id: dateKey }],
    }),
    upsertMoodCheckIn: builder.mutation<ApiRecord, UpsertMoodCheckInPayload>({
      query: ({ dateKey, happiness, stress, energy }) => ({
        url: "/mood-checkin",
        method: "POST",
        body: {
          date: dateKey,
          happiness,
          stress,
          energy,
        },
      }),
      transformResponse: (response: unknown) => extractMoodCheckIn(response) ?? {},
      invalidatesTags: (result, error, { dateKey }) => [
        { type: "Mood", id: dateKey },
      ],
    }),
    getCreditBalance: builder.query<ApiRecord, void>({
      query: () => noStoreGet("/credit/balance"),
      providesTags: ["Credits"],
    }),
    getSubscriptionPlans: builder.query<ApiList, void>({
      query: () => noStoreGet("/settings/subscription"),
      transformResponse: (response: unknown) => extractPlans(response),
      providesTags: ["Plans"],
    }),
    purchaseSubscription: builder.mutation<
      ApiRecord,
      PurchaseSubscriptionPayload
    >({
      query: (body) => ({
        url: "/settings/subscription/purchase",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Credits"],
    }),
    createChat: builder.mutation<ApiRecord, CreateChatPayload>({
      query: (body) => ({
        url: "/chat",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => extractChat(response) ?? {},
      invalidatesTags: ["Chats"],
    }),
    getChats: builder.query<ApiList, string>({
      query: (user) => noStoreGet(`/chat?user=${encodeURIComponent(user)}`),
      transformResponse: (response: unknown) => extractChats(response),
      providesTags: (result) =>
        result
          ? [
              ...result
                .map((chat) =>
                  typeof chat?._id === "string"
                    ? ({ type: "Chat", id: chat._id } as const)
                    : null,
                )
                .filter(Boolean),
              "Chats",
            ]
          : ["Chats"],
    }),
    getChat: builder.query<ApiRecord | null, string>({
      query: (chatId) => noStoreGet(`/chat/${chatId}`),
      transformResponse: (response: unknown) => extractChat(response),
      providesTags: (result, error, chatId) => [{ type: "Chat", id: chatId }],
    }),
    updateChat: builder.mutation<ApiRecord, UpdateChatPayload>({
      query: ({ chatId, updates }) => ({
        url: `/chat/${chatId}`,
        method: "PATCH",
        body: updates,
      }),
      transformResponse: (response: unknown) => extractChat(response) ?? {},
      invalidatesTags: (result, error, { chatId }) => [
        "Chats",
        { type: "Chat", id: chatId },
      ],
    }),
    deleteChat: builder.mutation<ApiRecord, string>({
      query: (chatId) => ({
        url: `/chat/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, chatId) => [
        "Chats",
        { type: "Chat", id: chatId },
        { type: "Messages", id: chatId },
      ],
    }),
    getChatMessages: builder.query<ApiList, string>({
      query: (chatId) =>
        noStoreGet(`/message?chatId=${encodeURIComponent(chatId)}`),
      transformResponse: (response: unknown) => extractMessages(response),
      providesTags: (result, error, chatId) => [
        { type: "Messages", id: chatId },
      ],
    }),
    createMessage: builder.mutation<ApiRecord, CreateMessagePayload>({
      query: (body) => ({
        url: "/message",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { chatId }) => [
        "Chats",
        { type: "Chat", id: chatId },
        { type: "Messages", id: chatId },
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyMobileMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateBasicProfileMutation,
  useUpdatePreferredLanguageMutation,
  useUpdateInterestsMutation,
  useGetMoodCheckInQuery,
  useUpsertMoodCheckInMutation,
  useGetCreditBalanceQuery,
  useGetSubscriptionPlansQuery,
  usePurchaseSubscriptionMutation,
  useCreateChatMutation,
  useGetChatsQuery,
  useGetChatQuery,
  useUpdateChatMutation,
  useDeleteChatMutation,
  useGetChatMessagesQuery,
  useCreateMessageMutation,
} = appApi;

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

type CreateChatPayload = {
  user: string;
};

type PurchaseSubscriptionPayload = {
  plan: ApiRecord;
};

function noStoreGet(url: string) {
  return {
    url,
    method: "GET" as const,
    cache: "no-store" as const,
  };
}

function extractProfile(payload: ApiRecord | null | undefined) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  return payload.data?.user ?? payload.user ?? payload.data ?? payload;
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

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery,
  tagTypes: ["Profile", "Credits", "Plans"],
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
      invalidatesTags: ["Profile", "Credits", "Plans"],
    }),
    getProfile: builder.query<ApiRecord | null, void>({
      query: () => noStoreGet("/user/profile"),
      transformResponse: (response: ApiRecord) => extractProfile(response),
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
  useGetCreditBalanceQuery,
  useGetSubscriptionPlansQuery,
  usePurchaseSubscriptionMutation,
  useCreateChatMutation,
} = appApi;

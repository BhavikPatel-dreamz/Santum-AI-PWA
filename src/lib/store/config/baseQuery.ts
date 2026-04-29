import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

export type AppApiError = FetchBaseQueryError & {
  message?: string;
  data?: {
    message?: string;
    [key: string]: unknown;
  };
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "same-origin",
});

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, AppApiError> =
  async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error) {
      const errorData =
        result.error.data && typeof result.error.data === "object"
          ? result.error.data
          : undefined;

      return {
        error: {
          ...result.error,
          data: errorData as AppApiError["data"],
          message:
            (errorData as AppApiError["data"] | undefined)?.message ||
            ("error" in result.error ? result.error.error : undefined) ||
            "Something went wrong",
        },
      };
    }

    return result;
  };

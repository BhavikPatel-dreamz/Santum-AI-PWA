import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

export type AppApiError = FetchBaseQueryError & {
  message?: string;
};

type AppApiErrorData = {
  offline?: boolean;
  message?: string;
  [key: string]: unknown;
};

export const OFFLINE_ERROR_MESSAGE =
  "No internet connection. Please reconnect and try again.";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "same-origin",
});

function isBrowserOffline() {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

function getRequestMethod(args: string | FetchArgs) {
  if (typeof args === "string") {
    return "GET";
  }

  return (args.method || "GET").toUpperCase();
}

function createOfflineError(): AppApiError {
  return {
    status: "CUSTOM_ERROR",
    error: "OFFLINE",
    message: OFFLINE_ERROR_MESSAGE,
    data: {
      offline: true,
      message: OFFLINE_ERROR_MESSAGE,
    },
  };
}

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, AppApiError> =
  async (args, api, extraOptions) => {
    if (isBrowserOffline()) {
      if (getRequestMethod(args) === "GET") {
        return { data: undefined };
      }

      return {
        error: createOfflineError(),
      };
    }

    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error) {
      const errorData =
        result.error.data && typeof result.error.data === "object"
          ? (result.error.data as AppApiErrorData)
          : undefined;
      const isOfflineFetchError =
        isBrowserOffline() &&
        result.error.status === "FETCH_ERROR" &&
        "error" in result.error;

      return {
        error: {
          ...result.error,
          message:
            (isOfflineFetchError ? OFFLINE_ERROR_MESSAGE : undefined) ||
            errorData?.message ||
            ("error" in result.error ? result.error.error : undefined) ||
            "Something went wrong",
        },
      };
    }

    return result;
  };
